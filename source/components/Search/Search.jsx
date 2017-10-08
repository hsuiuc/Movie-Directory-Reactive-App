import React, { Component } from 'react'
import {Input, Checkbox, Table} from 'semantic-ui-react'
import axios from 'axios'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import styles from './Search.scss'

//Search component
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: "",
            sortBy: "title",
            //true for ascending, false for descending
            sortOrder: false,
            api_url: "https://api.themoviedb.org/3/search/movie",
            api_key: "c3a98ed6df1dd7d61398d7815bfe367f",
            searchResults: []
        };
        this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
    }

    handleKeyWordChange(keyWord) {
        this.setState({
            keyWord: keyWord
        });
    }

    handleSortByChange(sortBy) {
        this.setState({
            sortBy: sortBy
        });
    }

    handleSortOrderChange() {
        this.setState({
            sortOrder: !this.state.sortOrder
        });
    }

    componentDidUpdate(prevProps, prevState) {

        const self = this;
        if (prevState.keyWord !== self.state.keyWord || prevState.sortBy !== self.state.sortBy || prevState.sortOrder !== self.state.sortOrder) {
            //console.log("state change");
            axios.get(self.state.api_url, {
                params: {
                    api_key: self.state.api_key,
                    query: self.state.keyWord
                }
            })
                .then(function (response) {
                    self.setState({
                        searchResults: response["data"]["results"].sort(function (a, b) {
                            if (self.state.sortBy === "title") {
                                return (self.state.sortOrder) ? a["title"].localeCompare(b["title"]) : b["title"].localeCompare(a["title"]);
                            } else {
                                return (self.state.sortOrder) ? a["vote_average"] - b["vote_average"] : b["vote_average"] - a["vote_average"];
                            }
                        })
                    });
                    //console.log(self.state.searchResults);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    render() {
        return(
            <div class="Search">
                <KeyWord
                    keyWord={this.state.keyWord}
                    onKeyWordChange={this.handleKeyWordChange}
                />
                <SortBy
                    sortBy={this.state.sortBy}
                    onSortByChange={this.handleSortByChange}
                />
                <SortOrder
                    sortOrder={this.state.sortOrder}
                    onSortOrderChange={this.handleSortOrderChange}
                />
                <SearchResultsList
                    searchResults={this.state.searchResults}
                    keyWord={this.state.keyWord}
                />
            </div>
        );
    }
}

class KeyWord extends Component {
    constructor(props) {
        super(props);
        this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
    }

    handleKeyWordChange(e) {
        this.props.onKeyWordChange(e.target.value);
    }

    render() {
        const keyWord = this.props.keyWord;

        return(
            <div>
                <Input placeholder='Search...' value={keyWord} onChange={this.handleKeyWordChange}/>
            </div>
        );
    }
}

KeyWord.propTypes = {
    keyWord: PropTypes.string
};

class SortBy extends Component {
    constructor(props) {
        super(props);
        this.handleSortByChange = this.handleSortByChange.bind(this);
    }

    handleSortByChange(e) {
        this.props.onSortByChange(e.target.value);
    }

    render() {
        const sortBy = this.props.sortBy;

        return(
            <div>
                <h3>Sort By</h3>
                <Input list='SortByOptions' placeholder='Sort By title or vote_average' value={sortBy} onChange={this.handleSortByChange}/>
                <datalist id='SortByOptions'>
                    <option value='title' />
                    <option value='vote_average' />
                </datalist>
            </div>
        );
    }
}

SortBy.propTypes = {
    sortBy: PropTypes.string
};

class SortOrder extends Component {
    constructor(props) {
        super(props);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
    }

    handleSortOrderChange(e) {
        this.props.onSortOrderChange();
    }

    render() {
        const checked = this.props.sortOrder;

        return(
            <div>
                <Checkbox label='Ascending' checked={checked} onChange={this.handleSortOrderChange}/>
                <Checkbox label='Descending' checked={!checked} onChange={this.handleSortOrderChange}/>
            </div>
        );
    }
}

SortOrder.propTypes = {
    sortOrder: PropTypes.string
};

class SearchResultsList extends Component {
    render() {
        let rows = [];
        this.props.searchResults.forEach((searchResult) => {
            rows.push(
                <SearchResult
                    title={searchResult["title"]}
                    vote_average={searchResult["vote_average"]}
                    overview={searchResult["overview"]}
                    id={searchResult["id"]}
                    keyWord={this.props.keyWord}
                />
            );
        });

        return(
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Vote Average</Table.HeaderCell>
                        <Table.HeaderCell>Overview</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        );
    }
}

SearchResultsList.propTypes = {
    searchResults: PropTypes.array
};

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return(
            <Table.Row>
                <Table.Cell>{this.props.title}</Table.Cell>
                <Table.Cell>{this.props.vote_average}</Table.Cell>
                <Table.Cell>{this.props.overview}<Link to={"/Detail/" + this.props.keyWord + "+" + this.props.id + ":" + "fromSearch"}>click to view details</Link></Table.Cell>
            </Table.Row>
        );
    }
}

SearchResult.propTypes = {
    title: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string
};

export default Search