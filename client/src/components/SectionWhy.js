import React from 'react';

const SectionWhy = () => {
    return (
        <div>
            <section className="section-features js--section-features" id="why">
                <div className="row">
                    <h2>Recycle the present, save the future.</h2>
                    <p className="long-copy">
                        We need to drastically improve our recycling habits – both at home and
                        in schools and workplaces. Recycling is crucial to the future health
                        of our planet. Here are some reasons why we should care recycling..
                     </p>
                </div>
                <div className="row js--wp-1">
                    <div className="col span-1-of-4 box">
                        <i className="ion-ios-flame-outline icon-big"></i>
                        <h3>Saving energy</h3>
                        <p>
                            Making products from recycled materials requires less energy than
                            making them from new raw materials. Sometimes it's a huge difference
                            in energy.
                        </p>
                    </div>
                    <div className="col span-1-of-4 box">
                        <i className="ion-ios-infinite-outline icon-big"></i>
                        <h3>Conserving natural resources</h3>
                        <p>
                            The world's natural resources are finite, and some are in very short
                            supply.
                         </p>
                    </div>
                    <div className="col span-1-of-4 box">
                        <i className="ion-ios-home-outline icon-big"></i>
                        <h3>Protecting ecosystems and wildlife</h3>
                        <p>
                            Recycling reduces the need to grow, harvest or extract new raw
                            materials from the Earth.
                        </p>
                    </div>
                    <div className="col span-1-of-4 box">
                        <i className="ion-ios-sunny-outline icon-big"></i>
                        <h3>Reducing Climate Change</h3>
                        <p>
                            Because recycling means you need to use less energy on sourcing and
                            processing new raw materials, it produces lower carbon emissions.
                         </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SectionWhy;