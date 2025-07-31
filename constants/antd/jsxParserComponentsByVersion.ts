import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  TimePicker,
  Upload,
  Checkbox,
  Radio,
  Select,
  Slider,
  Rate,
  Cascader,
  TreeSelect,
  Mentions,
  AutoComplete,
  Transfer,
  Switch,
  Descriptions,
  Steps,
  Space,
  Image,
  ColorPicker,
  Segmented,
  Watermark,
  QRCode,
} from "antd";
import PreviewTour from "../../components/PreviewTour";
import PreviewFloatButton from "../../components/PreviewFloatButton";

export const jsxParserComponentsV3 = {
  Form,
  FormItem: Form.Item,
  Input,
  "Input.Password": Input.Password,
  "Input.TextArea": Input.TextArea,
  InputNumber,
  Button,
  DatePicker,
  TimePicker,
  Upload,
  Checkbox,
  "Checkbox.Group": Checkbox.Group,
  Radio,
  "Radio.Group": Radio.Group,
  Select,
  "Select.Option": Select.Option,
  Slider,
  Rate,
  Cascader,
  TreeSelect,
  Mentions,
  AutoComplete,
  Transfer,
  Switch,
};

export const jsxParserComponentsV4 = {
  ...jsxParserComponentsV3,
  Descriptions,
  Steps,
  "Steps.Step": Steps.Step,
  Space,
};

export const jsxParserComponentsV5 = {
  ...jsxParserComponentsV4,
  Image,
  "Image.PreviewGroup": Image.PreviewGroup,
  ColorPicker,
  Segmented,
  Tour: PreviewTour,
  FloatButton: PreviewFloatButton,
  Watermark,
  QRCode,
};

export const jsxParserComponentsByVersion = {
  v3: jsxParserComponentsV3,
  v4: jsxParserComponentsV4,
  v5: jsxParserComponentsV5,
};
