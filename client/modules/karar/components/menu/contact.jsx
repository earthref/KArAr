import React from 'react';
import {Item} from 'semantic-ui-react';

import UserItem from '/client/modules/common/components/user_item';

export default class extends React.Component {

  render() {
    return (
      <div>
        <Item.Group divided>
          <UserItem portal="KARAR" id="njarboe"/>
          <UserItem portal="KARAR" id="rminnett"/>
          <UserItem portal="KARAR" id="ljonestrask"/>
          <UserItem portal="KARAR" id="cconstable"/>
          <UserItem portal="KARAR" id="akoppers"/>
          <UserItem portal="KARAR" id="ltauxe"/>
        </Item.Group>
      </div>
	  );
  }

}
