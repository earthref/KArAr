import _ from 'lodash';
import React from 'react';
import { HotTable, HotColumn } from "@handsontable/react";
import SearchRows from '/client/modules/karar/containers/search_rows';

import {versions, models} from '/lib/configs/karar/data_models';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nPages: props.nPages || 1,
      rowsData: undefined,
    };
    this.onScroll = _.throttle(() => {
      this._onScroll();
    }, 100);
    this.styles = {
      scroller: {overflowY: 'scroll', overflowX: 'scroll', background: 'white', borderRadius: '0', boxShadow: 'none'}
    }
  }

  componentDidMount() {
    // console.log('SearchRowsView did mount');
    this.timeoutScroll = setInterval(this.onScroll, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timeoutScroll);
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props.es, nextProps.es)) {
      this.setState({nPages: 0});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nPages === 0)
      this.setState({nPages: 1});
  }

  _onScroll() {
    const scrollerHeight = $(this.refs['scroller']).height();
    const scrollerPosition = this.refs['scroller'] && this.refs['scroller'].scrollTop;
    const contentHeight = $(this.refs['content']).height();

    let maxPages;
    if (this.props.count)
      maxPages = Math.ceil(this.props.count / this.props.pageSize);

    if (scrollerPosition > contentHeight - scrollerHeight - 50 ||
      scrollerHeight > contentHeight) {
      if (maxPages !== undefined && this.state.nPages < maxPages) {
        this.setState({nPages: this.state.nPages + 1});
      }
    }
  }

  hideIdenticalTitles() {
    let rowTitle;
    $(this.refs['content']).find('> tbody > tr > th:visible').each(function () {
      if (rowTitle === this.innerHTML)
        $(this).hide();
      else
        rowTitle = this.innerHTML;
    });
  }


  renderOld() {
    let model = models[_.last(versions)];
    let table = this.props.table;
    let sortedColumns = _.sortBy(_.keys(model.tables[table].columns), (column) => {
      return model.tables[table].columns[column].position;
    });
    let groups = _.reduce(sortedColumns, (groups, column) => {
      let group = model.tables[table].columns[column].group;
      if (groups.length === 0 || group !== groups[groups.length-1].name)
        groups.push({name: group, colSpan: 1});
      else
        groups[groups.length-1].colSpan += 1;
      return groups;
    }, []);
    let groupBorders = _.reduce(_.dropRight(groups), (borders, group) => {
      borders[borders.length + group.colSpan - 1] = true;
      return borders;
    }, []);
    return (<HotTable
        settings={{
            licenseKey: "non-commercial-and-evaluation",
            data: rowData,
            readOnly: true,
            contextMenu: false,
            rowHeaders: true,
            colHeaders: columns,
            outsideClickDeselects: false,
        }}
    >
        {columns.map((columnName, i) =>
            <HotColumn key={i} data={columnName}></HotColumn>
        )}
    </HotTable>);
    return (
      <div ref="scroller" style={_.extend({}, this.styles.scroller, this.props.style)} onScroll={this.onScroll}>
        <table ref="content" className="ui very compact celled small table"
               style={{borderLeft: 'none', borderRight: 'none', borderTop: 'none'}}>
          <thead>
            <tr>
              {groups.map((group, i) =>
                <th key={i}
                    colSpan={group.colSpan}
                    style={_.extend({whiteSpace: 'nowrap', textAlign: "center"}, i > 0 ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {group.name}
                </th>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <th key={i}
                    style={_.extend({whiteSpace: 'nowrap', verticalAlign: 'bottom'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {model.tables[table].columns[column].label}
                </th>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <td key={i}
                    style={_.extend({whiteSpace: 'nowrap', verticalAlign: 'bottom'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {model.tables[table].columns[column].type}
                  </td>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <td key={i}
                    data-position={i < sortedColumns.length - 5 ? (i >= 5 ? "bottom center" : "bottom left") : "bottom right"}
                    data-tooltip={model.tables[table].columns[column].description}
                    style={_.extend({whiteSpace: 'nowrap', borderBottom: '1px solid #AAAAAA'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  <i>{column}</i>
                </td>
              )}
            </tr>
          </thead>
          {false && _.times(this.state.nPages, (i) =>
            <SearchRows
              key={i}
              es={this.props.es}
              pageSize={this.props.pageSize}
              pageNumber={i+1}
              columns={sortedColumns}
              groupBorders={groupBorders}
              onDidUpdate={this.hideIdenticalTitles.bind(this)}
            />
          )}
        </table>
      </div>
    );
  }

  render() {
    let source = {
      include: [
        'columns',
        'rows',
        'summary.contribution._reference.citation',
        'summary.contribution.version',
        'summary.contribution.timestamp',
        'summary.contribution._contributor',
        'summary.contribution.id',
        'summary._all.sample',
        'summary._all.specimen',
        'summary._all.experiment'
      ]
    };
    let processData = (error, results) => {
      console.log('processData', error, results);
      try {
        if (error) {
          console.error(error);
        } else {
          let rows = [];
          let lastCID;
          let docs = results.hits.hits.map(hit => hit._source);
          console.log('docs', docs.length, docs[0]);
          if (docs.length > 0) {
            docs.forEach(doc => {
              let s = doc.summary;
              let docRows = doc.columns ? doc.rows.map(row => {
                rowObj = _.zipObject(doc.columns, row);
                rowObj['contribution_id'] = s.contribution.id;
                return rowObj;
              }) : doc.rows;
              let citation = s && s.contribution && s.contribution._reference && s.contribution._reference.citation || "Unknown";
              let version = s && s.contribution && s.contribution.version || "Unknown";
              let title = '<b>' + citation + ' v. ' + version + '</b>';
              if (this.props.es.type === 'samples' && s._all) {
                // if (s._all.sample) title += ' ⇒ <b>' + s._all.sample[0] + '</b>';
              }
              if (this.props.es.type === 'specimens' && s._all) {
                if (s._all.sample) title += ' ⇒ <b>' + s._all.sample[0] + '</b>';
                // if (s._all.specimen) title += ' ⇒ <b>' + s._all.specimen[0] + '</b>';
              }
              if (this.props.es.type === 'experiments' && s._all) {
                if (s._all.sample) title += ' ⇒ ' + s._all.sample[0];
                if (s._all.specimen) title += ' ⇒ <b>' + s._all.specimen[0] + '</b>';
                // if (s._all.experiment) title += ' ⇒ <b>' + s._all.experiment[0] + '</b>';
              }
              if (s.contribution.id != lastCID) {
                rows.push({ rows: docRows, title: title });
                lastCID = s.contribution.id;
              } else {
                rows[rows.length - 1].rows = rows[rows.length - 1].rows.concat(docRows);
              }
            });
            let rowsData = this.state.rowsData || [];
            rowsData = rowsData.concat(rows);
            this.setState({ rowsData });
            rows = [];
            rowsData = [];
            console.log('_scroll_id', results._scroll_id);
            if (results._scroll_id) {
              Meteor.call('esScrollByID', results._scroll_id, processData);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    if (!this.state.rowsData) {
      console.log('esScroll', _.extend({}, this.props.es, { source }), 10000);
      Meteor.call('esScroll', _.extend({}, this.props.es, { source }), 10000, processData);
    }
    if (!this.state.rowsData)
      return (
        <div className="ui bottom attached segment" style={_.extend({ overflow: 'hidden' }, this.props.style)}>
          <div className="ui inverted active dimmer">
            <div className="ui text loader">Loading Data</div>
          </div>
        </div>
      );
    if (!this.state.rowsData.length)
      return (
        <div className="ui bottom attached segment" style={_.extend({ overflow: 'hidden' }, this.props.style)}>
          <div className="ui fluid warning message">
            <div className="ui center aligned huge basic segment">No Rows to Display</div>
          </div>
        </div>
      );
    const model = models[_.last(versions)];
    const table = model.tables[this.props.table];
    const modelColumns = _.sortBy(
      _.keys(table.columns), columnName => table.columns[columnName].position
    );
    const usedColumns = {};
    this.state.rowsData.forEach(doc => doc.rows.forEach(row => _.keys(row).forEach(column => { usedColumns[column] = true; })));
    const columns = modelColumns.filter(x => usedColumns[x]);
    const rows = [];
    let rowIdx = 1;
    const rowHeaders = [];
    const mergeCells = [];
    let i = 0;
    this.state.rowsData.forEach(doc => {
      const titleRow = new Array(columns.length);
      titleRow[0] = doc.title;
      rows.push(titleRow);
      rowHeaders.push(null)
      mergeCells.push({ row: i, col: 0, rowspan: 1, colspan: columns.length });
      i += 1;
      doc.rows.forEach(row => {
        rows.push(columns.map(col => row[col]));
        i += 1;
        rowHeaders.push(rowIdx);
        rowIdx += 1;
      });
    });
    return (
      <HotTable
        className="handsontable-readonly"
        style={_.extend({ marginTop: -1, backgroundColor: '#FFF', overflow: 'hidden' }, this.props.style)}
        settings={{
          licenseKey: "non-commercial-and-evaluation",
          readOnly: true,
          contextMenu: false,
          rowHeaders: (i) => rowHeaders[i],
          colHeaders: true,
          // colHeaders: columns.map(column => table.columns[column].label),
          mergeCells: mergeCells,
          data: rows,
          disableVisualSelection: true,
          outsideClickDeselects: false,
          renderAllRows: false
        }}
      >
        {columns.map((columnName, i) =>
            <HotColumn key={i} title={table.columns[columnName].label} renderer={i == 0 ? 'html' : 'text'}></HotColumn>
        )}
      </HotTable>
    );
  }

}
