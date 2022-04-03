import React from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from '../images/Netflix';
import { Button, ConnectButton, Icon, Modal, Tab, TabList, useNotification } from 'web3uikit';
import { movies } from "../helpers/library";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Home = () => {

  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const [myMovies, setMyMovies] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();

  useEffect(() => {
    async function fetchMovieList() {
       await Moralis.start({
          serverUrl: "https://xq9lkddbjxjm.usemoralis.com:2053/server",
          appId: "4p1pb4RlHnFOMKu5dSjWG5J4nJdLGu3tP5c8X8oa",
        }); //if getting errors add this 

      const userMovieList = await Moralis.Cloud.run("getUserMovieList", {address: account});
      
      const filteredA = movies.filter(function(movie) {
        return userMovieList.indexOf(movie.Name) > -1;
      });

      setMyMovies(filteredA);
    }

    fetchMovieList();
  }, [account])

  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please connect your crypto wallet!",
      title: "Not Authenticated",
      position: "topL"
    })
  }

  return(
    <>
    <div className='logo'>
      <Logo />
    </div>
    <div className='connect'>
      <Icon fill="#ffffff" size={24} svg="bell"/>
      <ConnectButton />
    </div>
    <div className="topBanner">
      <TabList defaultActiveKey={1} tabStyle="bar">
        <Tab tabKey={1} tabName={"Movies"}>
          <div className="scene">
            <img src={movies[0].Scene} className="sceneImg"></img>
            <img src={movies[0].Logo} className="sceneLogo"></img>
            <p className="sceneDesc">{movies[0].Description}</p>
            <div className='playButton'>
              <Button 
                icon="chevronRightX2"
                text="Play"
                theme="secondary"
                type="button"
              />
              <Button
                icon="plus"
                text="Add to My List"
                theme="translucent"
                type="button"
              />
            </div>
          </div>

          <div className='title'>
            Movies
          </div>
          <div className='thumbs'>
            {movies &&
              movies.map((movie, index) => {
                return (<img src={
                  movie.Thumbnail} 
                  className='thumbnail'
                  onClick={() => {
                    setSelectedFilm(movie);
                    setVisible(true);
                  }}
                  key={index}
                  ></img>)
              })
            }
          </div>
        </Tab>
        <Tab tabKey={2} tabName={"Series"} isDisabled={true}></Tab>
        <Tab tabKey={3} tabName={"My List"}></Tab>
      </TabList>
      {selectedFilm && (
        <div className='modal'>
          <Modal
            onCloseButtonPressed={() => setVisible(false)}
            isVisible={visible}
            hasFooter={false}
            width='1000px'>

              <div className='modalContent'>
                <img src={selectedFilm.Scene} className="modalImg"></img>
                <img src={selectedFilm.Logo} className="modalLogo"></img>
                <div className='modalPlayButton'>
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button 
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={() => {console.log(isAuthenticated)}}
                      />
                    </>
                  ) : (
                    <>
                      <Button 
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )};
                  
                </div>
                <div className='movieInfo'>
                  <div className='description'>
                    <div className='details'>
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className='detailedInfo'>
                    Genre:
                    <span className='deets'>{selectedFilm.Genre}</span>
                    <br />
                    Actors:
                    <span className='deets'>{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
        </div>
      )}
      
    </div>

    </>
  )
}

export default Home;
