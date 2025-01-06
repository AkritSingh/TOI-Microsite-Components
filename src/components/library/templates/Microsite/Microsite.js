/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable no-console */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-danger */
/* eslint-disable import/no-extraneous-dependencies */
import React, { memo } from 'react';
import styles from './Microsite.scss';
import Header from '../../organisms/Header/Header';
import useStyles from 'isomorphic-style-loader-react18/useStyles';

// import Banner from '../../../components/library/organisms/Banner/Banner';
import ComponentListRenderer from '../../uiHelpers/ComponentListRenderer/ComponentListRenderer';

const Microsite = memo((props) => {
    useStyles(styles);
    const { sections = [] } = props;
    // const componentsMap = useMemo(() => ({
    //     about_v3: () => <About />,
    //     banner_v3: () => <Banner />,
    //     banner: () => <div>Banner</div>,
    // }));

    const data = sections;
    return (
        <div className={styles.microsite}>
            <Header />
            {/* {sections.map((section, index) => (
                <div ket={index}>
                    <ComponentRenderer
                        key={index}
                        compObj={section}

                    />
                </div>
            ))} */}
            <ComponentListRenderer
                data={data}
                type="ui_helpers_component_list_renderer"
                uniqueKey="before_body"
                insertKey="insert"
            />
            footer
        </div>
    );
});

export default Microsite;
