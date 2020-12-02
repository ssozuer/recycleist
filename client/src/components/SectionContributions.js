import React, { useEffect, useState } from 'react';
import recycleist from '../contract.js';

const SectionContributions = () => {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        const fetchContributions = async () => {
            const response = await recycleist.methods.getContributions().call()
            setContributions(response);
        };
        fetchContributions();

    }, [contributions.length]);


    const renderedResults = contributions.map(contribution => {
        return (
            <div key={contribution[0]} className="col span-1-of-4 box">
                <img src="resources/images/contribution.jpeg" alt={contribution[1]} />
                <div className="recycle-feature">
                    <h4>Recycle ID: {contribution[1]}</h4>
                </div>
                <div className="recycle-feature">
                    <h3>{contribution[2]}</h3>
                    <i className="ion-ios-pricetag icon-small"></i>
                    {contribution[0]}
                </div>
                <div className="recycle-feature">
                    <i className="ion-trash-a icon-small"></i>
                    {contribution[3]} kg
                </div>
                <div className="recycle-feature">
                    <i className="ion-email icon-small"></i>
                    {contribution[4].slice(0, 8)}...{contribution[4].slice(contribution[4].length - 7)}
                </div>

            </div>
        );
    });

    return (
        <div>
            <section className="section-contributions" id="contributions">
                <div className="row">
                    <h2>Contributions</h2>
                </div>
                <div className="row js--wp-3" >
                    {renderedResults}
                </div>
            </section>
        </div>
    );
};

export default SectionContributions;