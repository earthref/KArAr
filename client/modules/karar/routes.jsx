import _ from  'lodash';
import React from 'react';
import queryString from 'query-string'
import {Route, Switch, Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import {versions} from '/lib/configs/karar/data_models.js';
import Page from '/client/modules/common/components/page';
import KArArHome from '/client/modules/karar/components/home';

import KArArMenu from '/client/modules/karar/components/menu/menu';
import KArArContact from '/client/modules/karar/components/menu/contact';


import KArArSearch from '/client/modules/karar/components/search';
import KArArUploadContribution from '/client/modules/karar/components/upload_contribution';
import KArArPrivateContributions from '/client/modules/karar/components/private_contributions';
import KArArDataModel from '/client/modules/karar/components/data_model';

import KArArValidateContribution from '/client/modules/karar/components/validate_contribution';
import Error from '/client/modules/common/components/error';

const Routes = ({match}) => (
  <Switch>

    {/* Static Pages */}
    <Route exact path="/KArAr" render={() =>
      <Page portal="KArAr" menu={<KArArMenu/>}>
        <Helmet><title>KArAr Home | EarthRef.org</title></Helmet>
        <KArArHome/>
      </Page>
    }/>
    <Route exact path="/KArAr/contact" render={() =>
      <Page portal="KArAr" menu={<KArArMenu/>}>
        <Helmet><title>Contact KArAr | EarthRef.org</title></Helmet>
        <KArArContact/>
      </Page>
    }/>

    {/* Search Interface */}
    <Route exact path="/KArAr/search" render={({location}) => {
      let redirectTo;
      if (_.trim(location.hash) !== '') {
        try {
          let oldSearchState = JSON.parse(atob(location.hash.substr(1)));
          if (oldSearchState && oldSearchState.p && oldSearchState.p.length >= 0)
            redirectTo = {
              pathname: "/KArAr/search", 
              state: {
                search: `doi:"${oldSearchState.p[0]}"`
              }
            };
        } catch(e) { console.error(e); }
      }
      if (!redirectTo && location.search && location.search.length > 1) {
        redirectTo = {
          pathname: "/KArAr/search", 
          state: {
            search: location.search.substring(1)
          }
        };
      }
      return (redirectTo && <Redirect to={redirectTo}/> ||
        <Page fullWidth portal="KArAr" menu={<KArArMenu/>}>
          <Helmet><title>KArAr Search | EarthRef.org</title></Helmet>
          <KArArSearch search={location.state && location.state.search || ""}/>
        </Page>
      );
    }}/>
    <Route exact path="/KArAr/:id(\d+)/:private_key([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KArAr/search", 
        state: {
          search: `id:"${match.params.id}" private_key:"${match.params.private_key}" ` + location.search || ""
        }
      }}/>
    }/>
    <Route exact path="/KArAr/:id(\d+)" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KArAr/search", 
        state: {
          search: `id:"${match.params.id}" ` + location.search || ""
        }
      }}/>
    }/>
    <Route exact path="/KArAr/doi/:doi(.+)" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KArAr/search", 
        state: {
          search: `doi:"${match.params.doi}" ` + location.search || ""
        }
      }}/>
    }/>
    
    {/* Other Tools */}
    <Route exact path="/KArAr/validate" render={() =>
      <Page portal="KArAr" title="Validate a KArAr contribution:" menu={<KArArMenu/>}>
        <Helmet>
          <title>KArAr Validator | EarthRef.org</title>
        </Helmet>
        <KArArValidateContribution/>
      </Page>
    }/>

    <Route exact path="/KArAr/upload" render={() =>
      <Page portal="KArAr" title="Upload data into your private workspace:" menu={<KArArMenu/>}>
        <Helmet>
          <title>KArAr Uploader | EarthRef.org</title>
        </Helmet>
        <KArArUploadContribution/>
      </Page>
    }/>

    <Route exact path="/KArAr/private" render={({location}) =>
      <Page portal="KArAr" title="Manage your contributions:" menu={<KArArMenu/>}>
        <Helmet>
          <title>KArAr Private Workspace | EarthRef.org</title>
        </Helmet>
        <KArArPrivateContributions/>
      </Page>
    }/>

    <Redirect exact from="/KArAr/data-models" to={`/KArAr/data-models/${_.last(versions)}`}/>
    <Route exact path="/KArAr/data-models/:v" render={({match, location}) => {
      if (window.history.replaceState)
        window.history.replaceState({}, 'KArAr Data Models | EarthRef.org', '/KArAr/data-models/' + match.params.v);    
      return (
        <Page portal="KArAr" title="Browse the current and recent KArAr Data Models:" menu={<KArArMenu/>}>
          <Helmet>
            <title>KArAr Data Models | EarthRef.org</title>
          </Helmet>
          <KArArDataModel version={match.params.v} search={queryString.parse(location.search).q || ""}/>
        </Page>
      );
    }}/>
    
    {/* 404 Not Found */}
    <Route render={() =>
      <Page portal="KArAr" menu={<KArArMenu/>}>
        <Helmet>
          <title>KArAr Error | EarthRef.org</title>
        </Helmet>
        <Error title="Error 404: Sorry, this page is missing!"/>
      </Page>
    }/>
  </Switch>
);

export default Routes;
