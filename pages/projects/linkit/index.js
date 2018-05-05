/*
 * /linkit vs /linkit/ is very different, the latter messes up and causes SSR to mess up
 */
import 'isomorphic-fetch';
import { Component } from 'react';
import FacebookAuth from 'react-facebook-auth';
import Link from 'next/link';
import Head from 'next/head';

import Nav from '../../../components/linkit/Nav';
import Post from '../../../components/linkit/Post';
import post from '../../../lib/post';
import '../../../styles/linkit.scss';

const api = 'https://api.gerardvee.com/';

const FacebookLogin = ({ onClick }) =>
(
    <a className='normal-link' onClick={ onClick }>Login with Facebook</a>
);

const FacebookAuthenticate = () =>
(
    <FacebookAuth autoLoad={ true } appId='176820699610596' callback={ auth } component={ FacebookLogin } />
);

const auth = (res) => console.log(res);

export default class extends Component
{

    static async getInitialProps({ req })
    {
        const { session } = req;
        const user = !!session && session.passport ? !!session.passport.user : false;
        const res = await fetch(api + 'linkit/posts');
        const posts = await res.json();
        if (user)
        {
            const myInfo = await fetch(api + 'linkit/me', post({ id: session.passport.user.id }));
            const me = await myInfo.json();
            return { picture: session.passport.user.photos[0].value, posts, user, me };
        }        
        return { posts, user, picture: '', me: null };
    }

    render()
    {
        const { user, picture, posts, me } = this.props;
        return (
            <div>
                <Head>
                    <title>LinkIt</title>
                    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                </Head>
                <div className='linkit-home'>
                    <Nav>
                        { user && <Link href={ api + 'linkit/logout' }><a className='normal-link'>Logout</a></Link> }
                        { !user && <FacebookAuthenticate /> }
                        <Link href='./linkit/new'><a className='normal-link'>Make a new post</a></Link>
                    </Nav>
                    { (posts || [] ).map((post) => 
                        <Post { ...post } key={ post.id } me={ me } className='linkit-post' />
                    )}
                </div>
            </div>
        );
    }
}