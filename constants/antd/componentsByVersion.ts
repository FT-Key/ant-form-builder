export type FormComponent = {
  label: string;
  code: string;
};

export const v3: FormComponent[] = [
  {
    label: "Text Input",
    code: `<Form.Item label="Text" name="text"><Input /></Form.Item>`,
  },
  {
    label: "Password",
    code: `<Form.Item label="Password" name="password"><Input.Password /></Form.Item>`,
  },
  {
    label: "Textarea",
    code: `<Form.Item label="Message" name="message"><Input.TextArea rows={4} /></Form.Item>`,
  },
  {
    label: "Select",
    code: `<Form.Item label="Select" name="select"><Select><Select.Option value="1">Option 1</Select.Option><Select.Option value="2">Option 2</Select.Option></Select></Form.Item>`,
  },
  {
    label: "Date Picker",
    code: `<Form.Item label="Date" name="date"><DatePicker /></Form.Item>`,
  },
  {
    label: "Time Picker",
    code: `<Form.Item label="Time" name="time"><TimePicker /></Form.Item>`,
  },
  {
    label: "Range Picker",
    code: `<Form.Item label="Range" name="range"><DatePicker.RangePicker /></Form.Item>`,
  },
  {
    label: "Checkbox",
    code: `<Form.Item name="agree" valuePropName="checked"><Checkbox>I agree</Checkbox></Form.Item>`,
  },
  {
    label: "Checkbox Group",
    code: `<Form.Item label="Options" name="checkGroup"><Checkbox.Group options={['A', 'B', 'C']} /></Form.Item>`,
  },
  {
    label: "Radio Group",
    code: `<Form.Item label="Options" name="radio"><Radio.Group><Radio value="1">One</Radio><Radio value="2">Two</Radio></Radio.Group></Form.Item>`,
  },
  {
    label: "Switch",
    code: `<Form.Item label="Enable" name="enabled" valuePropName="checked"><Switch /></Form.Item>`,
  },
  {
    label: "Upload",
    code: `<Form.Item label="Upload" name="upload"><Upload fileList={[]}><Button>Click to Upload</Button></Upload></Form.Item>`,
  },
  {
    label: "Slider",
    code: `<Form.Item label="Volume" name="volume"><Slider /></Form.Item>`,
  },
  {
    label: "Rate",
    code: `<Form.Item label="Rate" name="rate"><Rate /></Form.Item>`,
  },
  {
    label: "Cascader",
    code: `<Form.Item label="Cascader" name="cascader"><Cascader options={[{ value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou' }] }]} /></Form.Item>`,
  },
  {
    label: "TreeSelect",
    code: `<Form.Item label="Tree" name="tree"><TreeSelect treeData={[{ title: 'Node1', value: '0-0', key: '0-0' }]} /></Form.Item>`,
  },
  {
    label: "InputNumber",
    code: `<Form.Item label="Number" name="number"><InputNumber /></Form.Item>`,
  },
  {
    label: "Mentions",
    code: `<Form.Item label="Mention" name="mention"><Mentions><Mentions.Option value="user1">@user1</Mentions.Option></Mentions></Form.Item>`,
  },
  {
    label: "AutoComplete",
    code: `<Form.Item label="Auto" name="auto"><AutoComplete options={[{ value: "Option 1" }, { value: "Option 2" }]} /></Form.Item>`,
  },
  {
    label: "Transfer",
    code: `<Form.Item label="Transfer" name="transfer"><Transfer dataSource={[{ key: '1', title: 'Item 1' }, { key: '2', title: 'Item 2' }]} targetKeys={[]} render={item => item.title} /></Transfer></Form.Item>`,
  },
  {
    label: "Search",
    code: `<Form.Item label="Search" name="search"><Input.Search placeholder="Search..." /></Form.Item>`,
  },
  {
    label: "Submit",
    code: `<Form.Item><Button type="primary" htmlType="submit">Submit</Button></Form.Item>`,
  },
];

const v4: FormComponent[] = [
  ...v3,
  {
    label: "Form List (no preview)",
    code: `// El Form.List debe manejarse manualmente en código, no se renderiza en preview.`,
  },
  {
    label: "Form Item",
    code: `<Form.Item label="Generic" name="generic"><Input /></Form.Item>`,
  },
  {
    label: "Input Group",
    code: `<Form.Item label="Group" name="group"><Space.Compact style={{ display: 'flex' }}><Input style={{ width: '50%' }} /><Input style={{ width: '50%' }} /></Space.Compact></Form.Item>`,
  },
  {
    label: "Descriptions",
    code: `<Descriptions title="User Info"><Descriptions.Item label="Name">John</Descriptions.Item></Descriptions>`,
  },
  {
    label: "Steps",
    code: `<Steps current={1}><Steps.Step title="Step 1" /><Steps.Step title="Step 2" /></Steps>`,
  },
];

export const v5: FormComponent[] = [
  ...v4,

  {
    label: "Color Picker",
    code: `<Form.Item label="Color" name="color"><ColorPicker /></Form.Item>`,
  },
  {
    label: "Segmented",
    code: `<Form.Item label="Segmented" name="segment"><Segmented options={['A', 'B']} /></Form.Item>`,
  },
  {
    label: "Tour",
    code: `<Tour open={false} steps={[{ title: 'Step 1', description: 'Do something' }]} />`,
  },
  {
    label: "Float Button",
    code: `<FloatButton />`,
  },
  {
    label: "Watermark",
    code: `<Watermark content="Demo"><div style={{ height: 100 }}>Watermarked</div></Watermark>`,
  },
  {
    label: "QRCode",
    code: `<QRCode value="https://ant.design" />`,
  },
  {
    label: "Image Preview Group",
    code: `<Image.PreviewGroup><Image src="https://via.placeholder.com/150" /><Image src="https://via.placeholder.com/150" /></Image.PreviewGroup>`,
  },
];

export const componentsByVersion = { v3, v4, v5 };
