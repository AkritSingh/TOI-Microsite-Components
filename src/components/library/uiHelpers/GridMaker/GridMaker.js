/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import classNames from 'classnames';
import {
  getSpacingStyles,
  getBorderStyles,
} from '../../utils/getStyleObject';
// eslint-disable-next-line css-modules/no-unused-class
import s from './GridMaker.scss';

function GridMaker(props) {
  const {
    layout,
    spacingClasses,
    isMobile,
    className,
    level,
    items,
    SectionWrapperComponent,
    SliderComponent,
    ga,
  } = props;
  useStyles(s);

  if (!(Array.isArray(layout) && layout.length > 0)) return null;

  let renderedComponentIndex = -1;

  const makeColumn = (columnObj, colIndex, rowIndex) => {
    const { componentMap, components } = props;
    const { span, spacing, border } = columnObj;

    if (!span) return null;
    renderedComponentIndex += 1;

    const spacingColClasses = getSpacingStyles(spacing, isMobile, 'column');
    const borderColClasses = getBorderStyles(border, 'column');

    const columnClasses = classNames({
      [`col_l_${span || '12'}`]: true,
    });

    const ColumnComponent =
      components[renderedComponentIndex] &&
      components[renderedComponentIndex].type &&
      componentMap &&
      typeof componentMap[components[renderedComponentIndex].type] ===
        'function'
        ? componentMap[components[renderedComponentIndex].type](
            components[renderedComponentIndex],
            level + 1,
            isMobile,
            items,
            ga,
            spacingClasses,
            SectionWrapperComponent,
            SliderComponent,
          )
        : null;
    if (!ColumnComponent) {
      return null;
    }

    return (
      <div
        className={`${columnClasses} ${spacingColClasses} ${borderColClasses}`}
        key={`grid-col-${rowIndex}`}
      >
        {ColumnComponent}
      </div>
    );
  };

  const makeRow = (row, index) => {
    if (!(Array.isArray(row) && row.length > 0)) return null;

    return (
      <div className={`row ${spacingClasses}`} key={`grid-row-${index}`}>
        {row.map((column, colIndex) =>
          makeColumn(column, colIndex, index, row.length),
        )}
      </div>
    );
  };

  return (
    <div className={`${s.grid} ${className}`}>
      {layout.map((columns, index) => makeRow(columns, index))}
    </div>
  );
}

GridMaker.propTypes = {
  layout: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))).isRequired,
  styles: PropTypes.shape({}),
  components: PropTypes.shape({}),
  componentMap: PropTypes.shape({}),
  isMobile: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  ga: PropTypes.shape({}),
  className: PropTypes.string,
  level: PropTypes.number,
  SectionWrapperComponent: PropTypes.func,
  SliderComponent: PropTypes.func,
  spacingClasses: PropTypes.string,
};

GridMaker.defaultProps = {
  styles: undefined,
  components: {},
  componentMap: {},
  isMobile: false,
  items: [],
  ga: undefined,
  className: '',
  level: 0,
  SectionWrapperComponent: undefined,
  SliderComponent: undefined,
  spacingClasses: '',
};

export default GridMaker;
