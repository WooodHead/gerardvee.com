import 'isomorphic-fetch';
import { Component } from 'react';
import Link from 'next/link';
import post from '../../lib/post';

const api = 'https://api.gerardvee.com/';

export default class extends Component
{
    state = { upvote: false, downvote: false };

    async componentDidUpdate(_props, _state, snapshot)
    {
        const { me, id } = this.props;
        if (_props.me === me)
        {
            return;
        }
        else
        {
            if (!!me)
            {
                this.setState({ upvote: me.upvotes.includes(id), downvote: me.downvotes.includes(id) });
            }
        }
    }

    async onUpvote()
    {
        const { id, token, alert } = this.props;
        const res = await fetch(api + `linkit/upvote/${ id }`, post({ token }));
        const upvoted = await res.json();
        if (upvoted.error)
        {
            alert(upvoted.error);
            return;
        }
        this.setState(upvoted);
    }

    async onDownvote()
    {
        const { id, token, alert } = this.props;
        const res = await fetch(api + `linkit/downvote/${ id }`, post({ token }));
        const downvoted = await res.json();
        if (downvoted.error)
        {
            alert(downvoted.error);
            return;
        }
        this.setState(downvoted);
    }

    render()
    {
        const { upvote, downvote } = this.state;
        const { title, link, stats, date, className } = this.props;
        return (
            <div className={ className ? className : '' }>
                <div className='voting-options'>
                    <i className={ `material-icons ${ upvote ? 'upvoted' : '' }` } onClick={ () => this.onUpvote() }>keyboard_arrow_up</i>
                    <i className={ `material-icons ${ downvote ? 'downvoted' : '' }` } onClick={ () => this.onDownvote() }>keyboard_arrow_down</i>
                </div>
                <a href={ !/^((http|https|ftp):\/\/)/.test(link) ? `http://${ link }` : link }><h1 className='linkit-link'>{ title }</h1></a>
            </div>
        );
    }
}