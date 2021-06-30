import React, { useContext } from 'react';
import { useQuery} from '@apollo/react-hooks';
import {Grid, Transition} from 'semantic-ui-react';

import {FETCH_POSTS_QUERY} from '../utils/graphql';
import PostForm from '../components/PostForm';
import Postcard from '../components/Postcard';
import { AuthContext } from '../context/auth';
import '../../src/index.css'

function Home() {
    const {user} = useContext(AuthContext);

    const {
        loading, 
        data: { getPosts: posts}={} 
    } = useQuery(FETCH_POSTS_QUERY);
    
    return (
    <Grid columns={3}>
        <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
    <Grid.Row>
        {user && (
            <Grid.Column>
                <PostForm/>   
            </Grid.Column>
        )}
      { loading ? (
          <h1>Loading Posts...</h1>
      ) : (
          <Transition.Group>
              {
                posts && 
                posts.map((post) => (
            //   In react when we iterate thru we give key value here post.id key
                <Grid.Column key={post.id} style={{ marginBottom: 25 }}>   
                    <Postcard post={post}/>
                </Grid.Column>
          ))}
          </Transition.Group>
      )}
    </Grid.Row>
    </Grid>
    );
}


export default Home;