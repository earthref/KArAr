import React from 'react';
import {Item} from 'semantic-ui-react';

import UserItem from '/client/modules/common/components/user_item';

export default class extends React.Component {

  render() {
    return (
      <div>
        <Item.Group divided>
          <UserItem portal="KArAr" id="njarboe"/>
          <UserItem portal="KArAr" id="rminnett"/>
          <UserItem portal="KArAr" id="ljonestrask"/>
          <UserItem portal="KArAr" id="cconstable"/>
          <UserItem portal="KArAr" id="akoppers"/>
          <UserItem portal="KArAr" id="ltauxe"/>
        </Item.Group>
      </div>
	  );
  }

}
