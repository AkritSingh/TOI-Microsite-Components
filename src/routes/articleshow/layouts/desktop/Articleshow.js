import React, { Suspense, lazy } from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';

import s from './Articleshow.scss';
import Heading from '../../components/Heading';

const LazySample = lazy(() => import('../../components/Sample'));

function Loading() {
  return (
    <p>
      <i>Loading...</i>
    </p>
  );
}
function Articleshow() {
  // const [render, setRender] = useState(false);
  useStyles(s);
  // useEffect(() => {
  //   // console.log('==============> articleshow');
  //   setTimeout(() => {
  //     setRender(true);
  //   }, 5000);
  // }, []);
  return (
    <div className={s.container}>
      <Suspense fallback={<Loading />}>
        <Heading text="Check this" />
      </Suspense>
      <LazySample />
      <br />
      {/* <CardLatest cardDetails="this is the first" /> */}
      <span className={s.spn}>Welcome!</span>Hello Articleshow
    </div>
  );
}

Articleshow.propTypes = {};

Articleshow.defaultProps = {};

export default Articleshow;
