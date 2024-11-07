import '../CSS/WelcomePage.css'
import {
    Animator, batch, Fade, FadeIn,
    Move, MoveIn, MoveOut, ScrollContainer,
    ScrollPage, Sticky, StickyIn, ZoomIn,
} from 'react-scroll-motion';
import { Link } from 'react-router-dom';

const ZoomInScrollOut = batch(StickyIn(), FadeIn(), ZoomIn());
const FadeUp = batch(Fade(), Sticky(), Move());
const MoveInOutFromLeft = batch(MoveIn(-1000, 0), MoveOut(-1000, 0));
const MoveInOutFromRight = batch(MoveIn(1000, 0), MoveOut(1000, 0));
const MoveInOutFromBottom = batch(MoveIn(0, 0), MoveOut(0, 0));

const WelcomePage = () => {
    return (
        <ScrollContainer>
            <ScrollPage>
                <Animator animation={batch(Sticky(), Fade(), MoveOut(0, -200))}>
                    <h1 style={{ fontSize: 125 }}>
                        Welcome To
                    </h1>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <Animator animation={ZoomInScrollOut}>
                    <h1 style={{ fontSize: 60, marginLeft: '-70%', marginBottom: 50 }}>
                        FriendZone
                    </h1>
                    <h1 style={{ fontSize: 60, marginLeft: '10%', marginBottom: 50 }}>
                        Collaboration
                    </h1>
                    <h1 style={{ fontSize: 60, marginLeft: '110%', marginBottom: 50 }}>
                        System
                    </h1>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <Animator animation={FadeUp}>
                    <h2></h2>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <Animator animation={FadeUp}>
                    <h1 style={{ fontSize: 60 }}>
                        What is FriendZone Collaboration System.
                    </h1>
                    <br /><br />
                    <h2 style={{ fontSize: 25 }}>
                        FriendZone Collaboration System is a platform which provide for all kind of user to use it, in order to help them to increase their productivity and teamwork.
                    </h2>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <Animator animation={FadeUp}>
                    <h2></h2>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <Animator animation={FadeUp}>
                    <h1 style={{ fontSize: 60 }}>
                        Why Choose FriendZone Collaboration System?
                    </h1>
                    <br /><br />
                    <h2 style={{ fontSize: 40, textAlign: 'center', marginTop: '-2%' }}>
                        This is because platform are:
                    </h2>
                    <h3 style={{ fontSize: 25, textAlign: 'center', marginTop: '2%' }}>
                        <b><i><p style={{ marginBottom: '-5%' }}>Security</p></i></b>
                        <br />
                        <b><i><p style={{ marginBottom: '-5%' }}>User Friendly</p></i></b>
                        <br />
                        <b><i><p style={{ marginBottom: '-5%' }}>Flexibility</p></i></b>
                        <br />
                        <b><i><p style={{ marginBottom: '-5%' }}>Real-Time Response</p></i></b>
                    </h3>
                </Animator>
            </ScrollPage>

            <ScrollPage>
                <div className='section_1'>
                    <h2>
                        <Animator animation={MoveInOutFromBottom} style={{ marginBottom: 50 }}>
                            <h1>Are You Get Ready To Enjoy The System? Let Go ~</h1>
                        </Animator>
                        <Animator animation={MoveInOutFromLeft} style={{ textAlign: 'center', marginBottom: 20, marginLeft: '3.5%' }}>
                            <Link to="/Login" style={{ color: 'whitesmoke' }}>Login</Link>
                        </Animator>
                        <Animator animation={MoveInOutFromRight} style={{ textAlign: 'center', marginLeft: '-4%' }}>
                            <Link to="/Register" style={{ color: 'whitesmoke' }}>Register</Link>
                        </Animator>
                    </h2>
                </div>
            </ScrollPage>
        </ScrollContainer>
    );
}

export default WelcomePage;