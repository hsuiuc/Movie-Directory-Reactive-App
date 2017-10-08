import React, { Component } from 'react'
import axios from 'axios'
import { Button, Card, Icon, Image } from 'semantic-ui-react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

import styles from './Gallery.scss'

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            genres_id: 28,
            api_url: "https://api.themoviedb.org/3/discover/movie",
            api_key: "c3a98ed6df1dd7d61398d7815bfe367f",
            searchResults: []
        };

        this.handleGenresChange = this.handleGenresChange.bind(this);
    }

    handleGenresChange(e) {
        let new_genres_id = e.target.attributes.getNamedItem('data-genres').value;
        //console.log(new_genres_id);
        this.setState({
            genres_id: new_genres_id
        });
        console.log(this.state.genres_id);
    }

    componentDidUpdate(prevProps, prevState) {

        const self = this;
        if (prevState.genres_id !== self.state.genres_id) {
            //console.log("state change");
            axios.get(self.state.api_url, {
                params: {
                    api_key: self.state.api_key,
                    with_genres: self.state.genres_id
                }
            })
                .then(function (response) {
                    self.setState({
                        searchResults: response["data"]["results"]
                    });
                    //console.log(self.state.searchResults[0]);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    render() {
        let rows = [];
        let imageBase = "https://image.tmdb.org/t/p/w154"
        this.state.searchResults.forEach((searchResult) => {
            rows.push(
                <Link to={"/Detail/" + this.state.genres_id + "+" + searchResult["id"] + ":" + "fromGallery"}>
                    <Image inline={true} centered={true} src={imageBase + searchResult["poster_path"]}></Image>
                </Link>
            );
        });

        return(
            <div class="Gallery">
                <div>
                    <Button data-genres={28} onClick={this.handleGenresChange}>Action</Button>
                    <Button data-genres={12} onClick={this.handleGenresChange}>Adventure</Button>
                    <Button data-genres={16} onClick={this.handleGenresChange}>Animation</Button>
                    <Button data-genres={35} onClick={this.handleGenresChange}>Comedy</Button>
                    <Button data-genres={80} onClick={this.handleGenresChange}>Crime</Button>
                    <Button data-genres={99} onClick={this.handleGenresChange}>Documentary</Button>
                    <Button data-genres={10751} onClick={this.handleGenresChange}>Family</Button>
                    <Button data-genres={27} onClick={this.handleGenresChange}>Horror</Button>
                    <Button data-genres={14} onClick={this.handleGenresChange}>Fantasy</Button>
                    <Button data-genres={36} onClick={this.handleGenresChange}>History</Button>
                    <Button data-genres={10402} onClick={this.handleGenresChange}>Music</Button>
                    <Button data-genres={878} onClick={this.handleGenresChange}>Sci-Fi</Button>
                    <Button data-genres={10752} onClick={this.handleGenresChange}>War</Button>
                </div>
                {rows}
            </div>
        )
    }
}

export default Gallery