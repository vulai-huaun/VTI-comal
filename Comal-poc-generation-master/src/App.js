import React from 'react';
import update from 'immutability-helper';
import yaml from 'js-yaml';
import clone from 'clone';
import ClipboardJS from 'clipboard';
import { Layout, Menu, Breadcrumb, Row, Col, Form, Input, Button, Affix, notification } from 'antd';
import RuleComponent from './Rule';
import Rule from './model/rule'
import { findObjectByIndex } from "./model/helper";
import { Select } from 'antd'; // 从 Ant Design 库中导入 Select 组件

const { Header, Content, Footer } = Layout;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "poc-yaml-sql",
      transport : "http",
      rules: [new Rule()],
      detail: {},
      poc: "",
    };

    this.updateRule = this.updateRule.bind(this);
    this.generatePOC = this.generatePOC.bind(this);
    this.addRule = this.addRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentDidMount() {
    const cjs = new ClipboardJS('#copy-btn');
    cjs.on('success', e => {
      this.notify("复制成功", "POC内容已成功复制到剪切板");
    })
  }

  notify(title, description) {
    notification.success({
      message: title,
      description: description,
      duration: 3,
    })
  }

  updateRule(index, key, value) {
    const i = findObjectByIndex(this.state.rules, index);
    if (i >= 0) {
      let rules = update(this.state.rules, {[i]: {[key]: {$set: value}}});
      this.setState({rules});
    }
  }

  deleteRule(index) {
    const i = findObjectByIndex(this.state.rules, index);
    if (i >= 0) {
      let rules = update(this.state.rules, {$splice: [[i, 1]]});
      this.setState({rules});
    }
  }

  generatePOC() {
    let data = {
      name: this.state.name,
      transport: this.state.transport,
      rules: clone(this.state.rules),
    };

    for (let rule of data.rules) {
      delete rule['index'];

      let headers = {};
      for (let header of rule.headers) {
        if (header['key']) {
          headers[header['key']] = header['value'];
        }
      }

      if (Object.keys(headers).length > 0) {
        rule.headers = headers;
      } else {
        delete rule.headers;
      }

      if (!rule.body.length) {
        delete rule.body;
      }

      if (!rule.path.length) {
        delete rule.path;
      }

      if (!rule.search.length) {
        delete rule.search;
      }

      rule.expression = `${rule.expression}\n`;

      let request = {};
      let expressionq = {};
      request.method = rule.method;
      request.follow_redirects = rule.follow_redirects;
      request.body = rule.body;
      request.path = rule.path;

      expressionq = rule.expression;

      delete rule.method;
      delete rule.follow_redirects;
      delete rule.body;
      delete rule.path;
      delete rule.expression;

      rule.request = request;
      rule.expression = expressionq;
    }

    let rulesObj = {};
    data.rules.forEach((rule, index) => {
      rulesObj[`r${index}`] = rule;
    });
    const ruleCount = Object.keys(rulesObj).length;
    function buildExpression(ruleCount) {
      let result = '';

      for (let i = 0; i < ruleCount; i++) {
        if (i > 0) {
          result += '&&';
        }
        result += `r${i}()`;
      }

      return result;
    }

    const poc = yaml.safeDump({
      name: this.state.name,
      transport: this.state.transport,
      rules: rulesObj,
      expression: buildExpression(ruleCount),
    });

    this.setState({ poc, isEditable: true });
  }


  addRule() {
    let rules = update(this.state.rules, {$push: [new Rule()]});
    this.setState({rules})
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return (
      <Layout className="layout">
        <Header>
          <div className="logo" ><span role="img" aria-label="dna" aria-hidden="true">🧬</span> Comal POC Generation</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>POC生成</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Row gutter={16} type="flex">
            <Col span={12} >
              <Form layout={"horizontal"} labelAlign="left">
                <Form.Item label="POC名" {...formItemLayout}>
                  <Input 
                    placeholder="由数字、字母、短横线组成" 
                    type="text" 
                    value={this.state.name}
                    onChange={e => this.setState({name: e.target.value})}
                  />
                </Form.Item>
                {this.state.rules.map((rule, index) =>
                  <RuleComponent
                    key={rule.index}
                    rule={rule}
                    ruleSize={this.state.rules.length}
                    updateHandler={this.updateRule}
                    addHandler={this.addRule}
                    deleteHandler={this.deleteRule}
                  />
                )}
              </Form>
            </Col>
              <Col span={12} style={{ paddingTop: "4px" }}>
                <Affix offsetTop={8}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: "15px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "bold"}}>请选择参考模板</span>
                      <br></br>
                      <Select
                        placeholder="选择生成的POC内容"
                        value={this.state.selectedPOC}
                        style={{ width: "100%" }}
                        onChange={value => this.setState({ selectedPOC: value })}
                      >
                        <Select.Option value="poc1">poc-yaml-sqli</Select.Option>
                        <Select.Option value="poc2">poc-yaml-xss</Select.Option>
                        <Select.Option value="poc3">poc-yaml-lfi</Select.Option>
                        <Select.Option value="poc4">poc-yaml-rce</Select.Option>
                        <Select.Option value="poc5">poc-yaml-leak</Select.Option>
                        <Select.Option value="poc6">poc-yaml-deser</Select.Option>
                        <Select.Option value="poc7">poc-yaml-fileUpload</Select.Option>
                        <Select.Option value="poc8">poc-yaml-httpReverse</Select.Option>
                        <Select.Option value="poc9">poc-yaml-ldapReverse</Select.Option>
                        {/* 根据需要添加更多选项 */}
                      </Select>
                    </div>
                    <div>
                      <Input.TextArea
                        autosize={{ minRows: 10 }}
                        placeholder="根据选择生成的POC内容"
                        value={this.state.selectedPOC === 'poc1' ? 'name: poc-yaml-sql\nrules:\n  - method: GET\n    path: /url\n    body: alert("xss")\n    follow_redirects: true\n    expression: |+' 
                        :this.state.selectedPOC === 'poc2' ? 'poc2的内容'
                        :this.state.selectedPOC === 'poc3' ? 'poc3的内容'
                        :this.state.selectedPOC === 'poc4' ? 'poc4的内容'
                        :this.state.selectedPOC === 'poc5' ? 'poc5的内容'
                        :this.state.selectedPOC === 'poc6' ? 'poc6的内容':
                        ''
                      }
                        readOnly={true}
                      />
                    </div>
                    <div>
                      <Input.TextArea
                        autosize={{ minRows: 10 }}
                        placeholder="生成POC内容"
                        value={this.state.poc}
                        id="poc-detail"
                        readOnly={!this.state.isEditable}
                        //将生成的内容可以进行编辑
                        onChange={(e) => this.setState({ poc: e.target.value })}
                      />
                    </div>
                    <Row justify="end" type="flex">
                      <Button type="primary" size="default" onClick={this.generatePOC} className="br">生成</Button>
                      <Button
                        type="dashed"
                        icon="copy"
                        id="copy-btn"
                        data-clipboard-text={this.state.poc}
                      >
                        复制POC
                      </Button>
                    </Row>
                  </div>
                </Affix>
              </Col>
          </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2023 Comal POC Generation</Footer>
      </Layout>
    );
  }
}