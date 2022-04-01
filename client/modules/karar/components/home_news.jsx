import React from 'react';
import {Link} from 'react-router-dom';
import {Image, Message} from 'semantic-ui-react';

import {portals} from '/lib/configs/portals.js';

export default class extends React.Component {

  render() {
    return (
      <div style={{textAlign: "justify"}}>
        <h3>
          <Image size="mini" src="/KArAr/FIESTA small.png" floated="left"/>
          {` EarthRef FIESTA`}
        </h3>
        <p>
          The EarthRef.org Digital Archive (KArAr) has been upgraded to use 
          EarthRef's new <b><a href="https://earthref.org/FIESTA">FIESTA software</a></b> to 
          support <b><a href="https://earthref.org/KArAr/private">private workspace</a></b> versioned 
          uploads validated against the KArAr <b><a href="https://earthref.org/KArAr/data-models">data model</a></b> and a  
          full-text <b><a href="https://earthref.org/KArAr/search">search interface</a></b> with filters and compilation 
          downloads. For the time being, the old KArAr site will be kept online <b><a href="https://earthref.org/KArAr-old">here</a></b>, 
          but new contributions to the repository will only be in the new system.
        </p>
      </div>
    );
  }

}
