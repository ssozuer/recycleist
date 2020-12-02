import React from 'react';
import ClaimReward from './ClaimReward';
import CreateRecycle from './CreateRecycle';
import ApproveContribution from './ApproveContribution';
import ContributeRecycle from './ContributeRecycle';
import CloseRecycle from './CloseRecycle';


const Header = () => {
    return (
        <div>
            <header>
                <nav>
                    <div className="row">
                        <img
                            src="resources/images/logo.png"
                            alt="recycleist logo"
                            className="logo"
                        />

                        <ul className="main-nav js--main-nav" >
                            <li><a href="#why">Why Care ?</a></li>
                            <li><a href="#works">How it works</a></li>
                            <li><a href="#recycles">Recycles</a></li>
                        </ul>
                        <a className="mobile-nav-icon js--nav-icon"
                        ><i className="ion-navicon-round"></i
                        ></a>
                    </div>
                </nav>
                <div className="hero-text-box">
                    <h1>
                        Be the change you want to see in the world: Reduce, Reuse, Recycle.<br />
                    </h1>
                    <ClaimReward />
                    <CreateRecycle />
                    <CloseRecycle />
                    <ContributeRecycle />
                    <ApproveContribution />
                </div>
            </header>
        </div>
    );
};

export default Header;