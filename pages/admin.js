import 'isomorphic-fetch';
import { Component } from 'react';
import { connect } from 'react-redux';

import FacebookAuthenticate from '../components/site/admin/FacebookAuthenticate';
import ModifyImages from '../components/site/admin/Images';
import { sendProjects, sendImages } from '../ducks/actions/site';

import '../styles/admin.scss';

const api = 'https://api.gerardvee.com/';
const noProfile = 'https://transhumane-partei.de/wp-content/uploads/2016/04/blank-profile-picture-973461_960_720.png';

const mapStateToProps = ({ site }) =>
({
    error: site.error,
    user: site.user,
    projects: site.projects,
    images: site.images,
});

export default connect(mapStateToProps)(class extends Component
{
    state =
    {
        activeResource: '',
        activeId: null,
    };

    static async getInitialProps({ store, req })
    {
        const projectsReq = await fetch(api + 'site/projects');
        const imagesReq = await fetch(api + 'site/images');
        const projects = await projectsReq.json();
        const images = await imagesReq.json();
        store.dispatch(sendProjects(projects));
        store.dispatch(sendImages(images));
        return {};
    }

    setAsActive(id)
    {
        this.setState({ activeId: id });
    }

    projectResource({ _id, image, title, description, url, finished })
    {
        const { activeId } = this.state;
        return (
            <div className={ 'row admin-selection-panel-selection-container valign' + (activeId === _id ? ' active' : '' ) } onClick={ () => this.setAsActive(_id) }>
                <img className='admin-selection-panel-image-picture' src={ image } />
                <div className='col admin-selection-panel-image-info' style={{ justifyContent: 'space-between', alignContent: 'space-between', height: 'auto' }}>
                    <p style={{ margin: 0 }}>{ finished ? '.' : 'o' }</p>
                    <p className='admin-selection-panel-project-title'>{ title }</p>
                    <p className='admin-selection-panel-image-id'>{ _id }</p>
                </div>
            </div>
        );
    }

    imageResource({ _id, location })
    {
        const { activeId } = this.state;
        return (
            <div className={ 'row admin-selection-panel-selection-container valign' + (activeId === _id ? ' active' : '' ) } onClick={ () => this.setAsActive(_id) }>
                <img className='admin-selection-panel-image-picture' src={ location } />
                <div className='col admin-selection-panel-image-info'>
                    <p className='admin-selection-panel-image-id'>{ _id }</p>
                </div>
            </div>
        );
    }

    // go here if there is no login or if the login is not ME
    userUnknown()
    {
        return (
            <div className='col halign valign full-height full-width'>
                <i className='material-icons admin-no-access-icon'>visibility_off</i>
                <h1 className='admin-no-access-message'>No Access</h1>
            </div>
        );
    }

    render()
    {
        const { error, user, projects, images } = this.props;
        const { activeResource } = this.state;
        const site = { projects, images };
        /*if (!user)
        {
            return this.productionUnknown();
        }*/
        return (
            <div className='row' style={{ padding: 0 }}>
                <div className='col admin-panel admin-user-panel'>
                    <FacebookAuthenticate />
                    <div className='row valign'>
                        <img className='admin-user-panel-picture' src={ noProfile } />
                        <div className='col'>
                            <h1 className='admin-user-panel-name'>Unknown</h1>
                            <h2 className='admin-user-panel-role'>> No role</h2>
                        </div>
                    </div>
                    <h2 className='admin-user-panel-resource'>Projects</h2>
                    <div className='admin-user-panel-resource-list'>
                        <button className={ 'admin-user-panel-resource-list-button' + (activeResource === 'projects' ? ' active' : '' ) }
                            onClick={ () => this.setState({ activeResource: 'projects' }) }>
                            <i className='material-icons'>folder</i>
                            Projects
                        </button>
                    </div>
                    <h2 className='admin-user-panel-resource'>Images</h2>
                    <div className='admin-user-panel-resource-list'>
                        <button className={ 'admin-user-panel-resource-list-button' + (activeResource === 'images' ? ' active' : '') }
                        onClick={ () => this.setState({ activeResource: 'images' }) }>
                            <i className='material-icons'>filter</i>
                            Images
                        </button>
                    </div>
                </div>
                { activeResource && <>
                    <div className='col admin-panel admin-selection-panel'>
                        <h1 className='admin-selection-panel-selection'>{ activeResource } ({ site[activeResource].length })</h1>
                        { site[activeResource].map(resource => (
                            activeResource === 'images' ? this.imageResource(resource) : this.projectResource(resource)
                        ))}
                    </div>
                </>}
                
                { !!user && <>
                    <img className='admin-user-panel-picture' src={ user.picture.data.url } />
                    <h1 className='admin-user-panel-name'>{ user.name }</h1>
                    <h2 className='admin-user-panel-role'>> Admin</h2>
                </> }
                {/*<ModifyImages />*/}
                {/*<p>{ JSON.stringify(error) }</p>*/}
            </div>
        );
    }
});