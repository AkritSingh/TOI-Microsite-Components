import classNames from 'classnames';

const DEFAULT_SCHEMA_TYPE = 'level_1';
const SUPPORTED_LEVELS = ['level_0', 'level_1', 'level_2', 'level_3'];
const DEFAULT_HORIZONTAL_POSITION_SCHEMA = {
  top: false,
  bottom: false,
  left: true,
  right: true,
};
const DEFAULT_VERTICAL_POSITION_SCHEMA = {
  top: false,
  bottom: true,
  left: true,
  right: true,
};
const DEFAULT_POSITION_SCHEMA = {
  top: false,
  bottom: false,
  left: true,
  right: true,
};

export const getSchemaStyles = (styleInfo, isMobile, scope) => {
  if (scope === 'column' && !styleInfo) return undefined;

  if (styleInfo?.noSpacing) {
    return undefined;
  }
  if (!styleInfo) {
    styleInfo = {};
  }

  const { device = isMobile ? 'mobile' : 'web', type = DEFAULT_SCHEMA_TYPE } =
    styleInfo;
  const schemaType = SUPPORTED_LEVELS.includes(type)
    ? type
    : DEFAULT_SCHEMA_TYPE;
  const deviceSchemaClasses = classNames({
    w_0: device === 'web' && schemaType === 'level_0' && scope !== 'column',
    w_0_col: device === 'web' && schemaType === 'level_0' && scope === 'column',
    w_1: device === 'web' && schemaType === 'level_1' && scope !== 'column',
    w_1_col: device === 'web' && schemaType === 'level_1' && scope === 'column',
    w_2: device === 'web' && schemaType === 'level_2' && scope !== 'column',
    w_2_col: device === 'web' && schemaType === 'level_2' && scope === 'column',

    m_0: device === 'mobile' && schemaType === 'level_0' && scope !== 'column',
    m_1: device === 'mobile' && schemaType === 'level_1' && scope !== 'column',
    m_2: device === 'mobile' && schemaType === 'level_2' && scope !== 'column',
    m_3: device === 'mobile' && schemaType === 'level_3' && scope !== 'column',
  });

  return deviceSchemaClasses;
};

export const getSpacingStyles = (styleInfo, isMobile, scope, layout) => {
  if (scope === 'column' && !styleInfo) return undefined;

  if (styleInfo?.noSpacing) {
    return undefined;
  }

  const parentSchemaStyles = getSchemaStyles(styleInfo, isMobile, scope);

  if (!styleInfo) {
    styleInfo = {};
  }
  let { positions } = styleInfo;

  if (!positions) {
    if (layout === 'horizontal' || layout === 'slider') {
      positions = DEFAULT_HORIZONTAL_POSITION_SCHEMA;
    } else if (layout === 'vertical') {
      positions = DEFAULT_VERTICAL_POSITION_SCHEMA;
    } else {
      positions = DEFAULT_POSITION_SCHEMA;
    }
  }
  const spacingSchemaClasses = classNames(parentSchemaStyles, {
    left_spacing: positions && positions.left,
    right_spacing: positions && positions.right,

    top_spacing:
      positions &&
      positions.top &&
      !(
        layout === 'vertical' ||
        layout === 'horizontal' ||
        layout === 'slider'
      ),
    top_v_spacing: positions && positions.top && layout === 'vertical',
    top_h_spacing:
      positions &&
      positions.top &&
      (layout === 'horizontal' || layout === 'slider'),

    bottom_spacing:
      positions &&
      positions.bottom &&
      !(
        layout === 'vertical' ||
        layout === 'horizontal' ||
        layout === 'slider'
      ),
    bottom_v_spacing: positions && positions.bottom && layout === 'vertical',
    bottom_h_spacing:
      positions &&
      positions.bottom &&
      (layout === 'horizontal' || layout === 'slider'),
  });

  return spacingSchemaClasses;
};

export const getBorderStyles = (styleInfo, scope) => {
  if (!styleInfo) return undefined;

  const { type = '', positions = {} } = styleInfo;

  const borderSchemaClasses = classNames({
    t_brdr: positions && positions.top,
    b_brdr: positions && positions.bottom,
    r_brdr: positions && positions.right,
    l_brdr: positions && positions.left,

    brdr_1: type === 'level_1' && scope !== 'column',
    brdr_2: type === 'level_2' && scope !== 'column',
    brdr_3: type === 'level_3' && scope !== 'column',
    brdr_4: type === 'level_3' && scope !== 'column',
    brdr_6: type === 'level_6' && scope !== 'column',
    brdr_7: type === 'level_3' && scope !== 'column',

    brdr_1_col: type === 'level_1' && scope === 'column',
    brdr_2_col: type === 'level_2' && scope === 'column',
    brdr_3_col: type === 'level_3' && scope === 'column',
    brdr_4_col: type === 'level_3' && scope === 'column',
    brdr_6_col: type === 'level_6' && scope === 'column',
    brdr_7_col: type === 'level_7' && scope === 'column',
  });

  return borderSchemaClasses;
};
