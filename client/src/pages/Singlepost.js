import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { Button, Card, Grid, Icon, Label, Image, Form } from 'semantic-ui-react';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';


function Singlepost(props){

    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    
    const [comment, setComment] = useState('');  

    const {data: { getPost }={}} = useQuery(FETCH_POSTS_QUERY, {
        variables: {postId}
    });

    const [submitComment] = useMutation(POST_COMMENT_MUTATION, {
        update(){
            setComment('');
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/');
      }


    let postMarkup;

    if(!getPost){
        postMarkup = <p>Loading Post...</p>
    } else {
        const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Image 
                        size='small'
                        src='https://cdn.dribbble.com/users/588874/screenshots/2249528/dribbble.png'
                        float="right"
                        />
                    </Grid.Column>

                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Button 
                                    as="div"
                                    labelPosition="right"
                                    onClick={()=> console.log("Comment on Post")} >
                                        <Button basic color="teal">
                                            <Icon name="comments"/>
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                    {user && user.username === username && (
                                        <DeleteButton postId={id} callback={deletePostCallback}/>
                                    )}
                            </Card.Content>
                        </Card>

                        {user && 
                            <Card fluid>
                                <Card.Content>
                                <p>Post a Comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            placeholder="Comment.."
                                            name="comment"
                                            value={comment}
                                            onChange={event => setComment(event.target.value)}
                                        />
                                        <button type="submit"
                                            className="ui button blue"
                                            disabled={comment.trim() === ''}
                                            onClick={submitComment}
                                            >
                                                Post Comment
                                            </button>
                                    </div>
                                </Form>
                                </Card.Content>
                            </Card>
                        }                    

                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                    
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const POST_COMMENT_MUTATION = gql `
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount   
        }
    }
`;

const FETCH_POSTS_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`;
export default Singlepost;