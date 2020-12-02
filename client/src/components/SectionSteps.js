import React from 'react';

const SectionSteps = () => {
    return (
        <div>
            <section className="section-steps" id="works">
                <div className="row">
                    <h2>How it works &mdash; Simple as 1, 2, 3</h2>
                </div>
                <div className="row">
                    <div className="col span-1-of-2 steps-box">
                        <img
                            src="resources/images/recycling-image.jpg"
                            alt="recycling-image"
                            className="app-screen js--wp-2"
                        />
                    </div>
                    <div className="col span-1-of-2 steps-box">
                        <div className="works-step clearfix">
                            <div>1</div>
                            <p>
                                A recycle request is created with a goal, deadline and total
                                reward. Anyone can create recycle.
            </p>
                        </div>
                        <div className="works-step clearfix">
                            <div>2</div>
                            <p>
                                The recyclists can join the current open recycles and tries to be
                                rewarded by the recycle owners.
            </p>
                        </div>
                        <div className="works-step clearfix">
                            <div>3</div>
                            <p>
                                The recyclists claim their rewards if they join and contribute to
                                the recycle after the deadline.
            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SectionSteps;