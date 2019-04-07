﻿import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IApplicationState } from '../../store';
import { RoutesConfig } from '../../config/routes.config';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavBar: React.FC<{ isAuthenticated: boolean; }> = (props) => {
    return (
        <nav className='navbar' role='navigation' aria-label='main navigation'>
            <div className='navbar-wrapper'>
                <div className='brand-wrapper'>
                    <img src={require('../../assets/image/bulma.io-logo.png')} alt='Bulma Logo' width='165' />
                </div>
                <div className='navbar-routes'>
                    {
                        props.isAuthenticated && (
                            <React.Fragment>
                                <NavLink exact={true} to={RoutesConfig.Form.path} className='navbar-item' activeClassName='is-active'>
                                    <span className='icon'>
                                        <FontAwesomeIcon icon={RoutesConfig.Form.icon as IconProp} />
                                    </span>
                                    <span>{RoutesConfig.Form.displayName}</span>
                                </NavLink>
                                <NavLink exact={true} to={RoutesConfig.Dashboard.path} className='navbar-item' activeClassName='is-active'>
                                    <span className='icon'>
                                        <FontAwesomeIcon icon={RoutesConfig.Dashboard.icon as IconProp} />
                                    </span>
                                    <span>{RoutesConfig.Dashboard.displayName}</span>
                                </NavLink>
                                <NavLink exact={true} to={RoutesConfig.FetchData.path} className='navbar-item' activeClassName='is-active'>
                                    <span className='icon'>
                                        <FontAwesomeIcon icon={RoutesConfig.FetchData.icon as IconProp} />
                                    </span>
                                    <span>{RoutesConfig.FetchData.displayName}</span>
                                </NavLink>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
        </nav>
    );
};

// Map only necessary IApplicationState to NavBar props
const mapStateToProps = (state: IApplicationState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

// Wire up the React component to the Redux store
export default connect(mapStateToProps)(NavBar);