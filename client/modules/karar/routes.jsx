import _ from  'lodash';
import React from 'react';
import queryString from 'query-string'
import {Route, Switch, Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import {versions} from '/lib/configs/karar/data_models.js';
import Page from '/client/modules/common/components/page';
import KARARHome from '/client/modules/karar/components/home';

import KARARMenu from '/client/modules/karar/components/menu/menu';
import KARARContact from '/client/modules/karar/components/menu/contact';


import KARARSearch from '/client/modules/karar/components/search';
import KARARUploadContribution from '/client/modules/karar/components/upload_contribution';
import KARARPrivateContributions from '/client/modules/karar/components/private_contributions';
import KARARDataModel from '/client/modules/karar/components/data_model';

import KARARValidateContribution from '/client/modules/karar/components/validate_contribution';
import Error from '/client/modules/common/components/error';

const Routes = ({match}) => (
  <Switch>

    {/* Static Pages */}
    <Route exact path="/KARAR" render={() =>
      <Page portal="KARAR" menu={<KARARMenu/>}>
        <Helmet><title>KARAR Home | EarthRef.org</title></Helmet>
        <KARARHome/>
      </Page>
    }/>
    <Route exact path="/KARAR/contact" render={() =>
      <Page portal="KARAR" menu={<KARARMenu/>}>
        <Helmet><title>Contact KARAR | EarthRef.org</title></Helmet>
        <KARARContact/>
      </Page>
    }/>

    {/* Search Interface */}
    <Route exact path="/KARAR/search" render={({location}) => {
      let redirectTo;
      if (_.trim(location.hash) !== '') {
        try {
          let oldSearchState = JSON.parse(atob(location.hash.substr(1)));
          if (oldSearchState && oldSearchState.p && oldSearchState.p.length >= 0)
            redirectTo = {
              pathname: "/KARAR/search", 
              state: {
                search: `doi:"${oldSearchState.p[0]}"`
              }
            };
        } catch(e) { console.error(e); }
      }
      if (!redirectTo && location.search && location.search.length > 1) {
        redirectTo = {
          pathname: "/KARAR/search", 
          state: {
            search: location.search.substring(1)
          }
        };
      }
      return (redirectTo && <Redirect to={redirectTo}/> ||
        <Page fullWidth portal="KARAR" menu={<KARARMenu/>}>
          <Helmet><title>KARAR Search | EarthRef.org</title></Helmet>
          <KARARSearch search={location.state && location.state.search || ""}/>
        </Page>
      );
    }}/>
    <Route exact path="/KARAR/:id(\d+)/:private_key([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KARAR/search", 
        state: {
          search: `id:"${match.params.id}" private_key:"${match.params.private_key}" ` + location.search || ""
        }
      }}/>
    }/>
    <Route exact path="/KARAR/:id(\d+)" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KARAR/search", 
        state: {
          search: `id:"${match.params.id}" ` + location.search || ""
        }
      }}/>
    }/>
    <Route exact path="/KARAR/doi/:doi(.+)" render={({match, location}) =>
      <Redirect to={{
        pathname: "/KARAR/search", 
        state: {
          search: `doi:"${match.params.doi}" ` + location.search || ""
        }
      }}/>
    }/>
    
    {/* Other Tools */}
    <Route exact path="/KARAR/validate" render={() =>
      <Page portal="KARAR" title="Validate a KARAR contribution:" menu={<KARARMenu/>}>
        <Helmet>
          <title>KARAR Validator | EarthRef.org</title>
        </Helmet>
        <KARARValidateContribution/>
      </Page>
    }/>

    <Route exact path="/KARAR/upload" render={() =>
      <Page portal="KARAR" title="Upload data into your private workspace:" menu={<KARARMenu/>}>
        <Helmet>
          <title>KARAR Uploader | EarthRef.org</title>
        </Helmet>
        <KARARUploadContribution/>
      </Page>
    }/>

    <Route exact path="/KARAR/private" render={({location}) =>
      <Page portal="KARAR" title="Manage your contributions:" menu={<KARARMenu/>}>
        <Helmet>
          <title>KARAR Private Workspace | EarthRef.org</title>
        </Helmet>
        <KARARPrivateContributions/>
      </Page>
    }/>

    <Redirect exact from="/KARAR/data-models" to={`/KARAR/data-models/${_.last(versions)}`}/>
    <Route exact path="/KARAR/data-models/:v" render={({match, location}) => {
      if (window.history.replaceState)
        window.history.replaceState({}, 'KARAR Data Models | EarthRef.org', '/KARAR/data-models/' + match.params.v);    
      return (
        <Page portal="KARAR" title="Browse the current and recent KARAR Data Models:" menu={<KARARMenu/>}>
          <Helmet>
            <title>KARAR Data Models | EarthRef.org</title>
          </Helmet>
          <KARARDataModel version={match.params.v} search={queryString.parse(location.search).q || ""}/>
        </Page>
      );
    }}/>
    
    {/* 404 Not Found */}
    <Route render={() =>
      <Page portal="KARAR" menu={<KARARMenu/>}>
        <Helmet>
          <title>KARAR Error | EarthRef.org</title>
        </Helmet>
        <Error title="Error 404: Sorry, this page is missing!"/>
      </Page>
    }/>
  </Switch>
);

export default Routes;
