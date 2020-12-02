import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer>
                <div className="row">
                    <div className="col span-1-of-2">
                        <ul className="footer-nav">
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">iOS</a></li>
                            <li><a href="#">Android</a></li>
                        </ul>
                    </div>
                    <div className="col span-1-of-2">
                        <ul className="social-icons">
                            <li>
                                <a href="#"><i className="ion-social-facebook"></i></a>
                            </li>
                            <li>
                                <a href="#"><i className="ion-social-twitter"></i></a>
                            </li>
                            <li>
                                <a href="#"><i className="ion-social-googleplus"></i></a>
                            </li>
                            <li>
                                <a href="#"><i className="ion-social-instagram"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <p>Copyright &copy; 2020 by ConsenSys</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;