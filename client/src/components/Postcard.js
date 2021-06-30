import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";



function Postcard({post : { body, createdAt, id, username, likeCount, commentCount, likes}}){
    
  const { user } = useContext(AuthContext);
    

    return(
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='tiny'
          src='https://cdn.dribbble.com/users/588874/screenshots/2249528/dribbble.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        
        {/* Like button */}
        <LikeButton user={user} post={{ id, likes,likeCount }} />

        {/* comment button */}
        <Popup
        content="Comment on Post"
        inverted
        trigger = {
         <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button color='teal' basic>
               <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
                {commentCount}
            </Label>
         </Button>
         }/>
        {user && user.username === username && <DeleteButton postId={id}/> }
      </Card.Content>
    </Card>
    )
}
export default Postcard;