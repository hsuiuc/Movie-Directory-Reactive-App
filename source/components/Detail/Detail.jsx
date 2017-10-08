import React, { Component } from 'react'
import axios from 'axios'
import { Button, Card, Icon, Image } from 'semantic-ui-react'

import styles from './Detail.scss'

class Detail extends Component {
    constructor(props) {
        super(props);
        let passedString = this.props.match.params.passedProps;
        this.state = {
            keyWord: passedString.substring(0, passedString.indexOf("+")),
            cur_id: passedString.substring(passedString.indexOf("+") + 1, passedString.indexOf(":")),
            from: passedString.substring(passedString.indexOf(":") + 1),
            cur_index: 0,
            api_url_search: "https://api.themoviedb.org/3/search/movie",
            api_url_discover: "https://api.themoviedb.org/3/discover/movie",
            api_key: "c3a98ed6df1dd7d61398d7815bfe367f",
            searchResults: []
        };
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handlePrev(e) {
        let prev = (this.state.cur_index - 1 + this.state.searchResults.length) % this.state.searchResults.length;
        this.setState({
            cur_index: prev
        });
    }

    handleNext(e) {
        let next = (this.state.cur_index + 1 + this.state.searchResults.length) % this.state.searchResults.length;
        this.setState({
            cur_index: next
        });
    }

    componentDidMount() {
        const self = this;
        let url = "";
        let params = {};
        if (self.state.from === "fromSearch") {
            url = self.state.api_url_search;
            params = {
                params: {
                    api_key: self.state.api_key,
                    query: self.state.keyWord
                }
            };
        } else if (self.state.from === "fromGallery") {
            url = self.state.api_url_discover;
            params = {
                params: {
                    api_key: self.state.api_key,
                    with_genres: self.state.keyWord
                }
            };
        }

        axios.get(url, params)
            .then(function (response) {
                self.setState({
                    searchResults: response["data"]["results"]
                });
                for (let i = 0; i < self.state.searchResults.length; i++) {
                    if (self.state.searchResults[i]["id"] === parseInt(self.state.cur_id)) {
                        self.setState({
                            cur_index: i
                        });
                    }
                }
                //console.log(self.state.searchResults);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let object = this.state.searchResults[this.state.cur_index];
        if (typeof object != "undefined") {
            return(
                <div class="Detail">
                    <RecordInDetail
                        content={object}
                    />
                    <Button onClick={this.handlePrev}>prev</Button>
                    <Button onClick={this.handleNext}>next</Button>
                </div>
            );
        } else {
            return(null);
        }
    }
}

class RecordInDetail extends Component {
    render() {
        let imageBase = "https://image.tmdb.org/t/p/w500";

        return(
            <Card centered={true}>
                <Image src={imageBase + this.props.content["poster_path"]} />
                <Card.Content>
                    <Card.Header>
                        {this.props.content["title"]}
                    </Card.Header>
                    <Card.Meta>
                        <span className='date'>
                            {this.props.content["release_date"]}
                        </span>
                        <span className='date'>
                            vote-average {this.props.content["vote_average"]}
                        </span>
                    </Card.Meta>
                    <Card.Description>
                        {this.props.content["overview"]}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        vote-count {this.props.content["vote_count"]}
                    </a>
                </Card.Content>
            </Card>
        );
    }
}

export default Detail