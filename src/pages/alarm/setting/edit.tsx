import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Button, Card, Col, Icon, Input, Modal, Row, Radio, Switch, Tooltip,Select} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {alarm} from '../data';
import Triggers from './Triggers';
import ActionAssembly from './actions'
// import Triggers from '@/pages/device/alarm/save/triggers/index';
// import ActionAssembly from '@/pages/device/alarm/save/actions/index';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<alarm>;
  // target: string;
  targetId?: string;
  metaData?: string;
  name?: string;
  productName?: string;
  productId?: string;
}

interface State {
  properties: any[];
  data: Partial<alarm>;
  trigger: any[];
  action: any[];
  shakeLimit: any;
}

const Edit: React.FC<Props> = props => {

  const initState: State = {
    properties: [],
    data: props.data,
    trigger: [],
    action: [],
    shakeLimit: {},
  };

  const [data] = useState(initState.data);
  const [properties, setProperties] = useState(initState.properties);
  const [trigger, setTrigger] = useState(initState.trigger);
  const [action, setAction] = useState(initState.action);
  const [shakeLimit, setShakeLimit] = useState(initState.shakeLimit);

  const submitData = () => {
    data.name = props.data.name;
    data.target = props.target;
    data.targetId = props.targetId;
    if (props.target === 'device') {
      data.alarmRule = {
        name: props.name,
        deviceId: props.targetId,
        deviceName: props.name,
        triggers: trigger,
        actions: action,
        properties: properties,
        productId: props.productId,
        productName: props.productName,
        shakeLimit: shakeLimit,
      };
    } else {
      data.alarmRule = {
        name: props.name,
        productId: props.targetId,
        productName: props.name,
        triggers: trigger,
        actions: action,
        properties: properties,
        shakeLimit: shakeLimit,
      };
    }
    props.save({...data});
  };

  useEffect(() => {

    if (props.data.alarmRule) {
      setShakeLimit(props.data.alarmRule.shakeLimit ? props.data.alarmRule.shakeLimit : {
        enabled: false,
        time: undefined,
        threshold: undefined,
        alarmFirst: true
      });
      setTrigger(props.data.alarmRule.triggers.length > 0 ? [...props.data.alarmRule.triggers] : [{_id: 0}]);
      setAction(props.data.alarmRule.actions.length > 0 ? [...props.data.alarmRule.actions] : [{_id: 0}]);
      setProperties(props.data.alarmRule.properties.length > 0 ? [...props.data.alarmRule.properties] : [{_id: 0}]);
    } else {
      setTrigger([{_id: 0}]);
      setAction([{_id: 0}]);
      setProperties([{_id: 0}]);
    }
  }, []);

  const removeProperties = (val: number) => {
    properties.splice(val, 1);
    setProperties([...properties]);
  };

  return (
    <Modal
      title={`${props.data?.id ? '编辑' : '新建'}告警`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      style={{marginTop: '-3%'}}
      width={660}
      onCancel={() => props.close()}
    >
      <div style={{maxHeight: 750, overflowY: 'auto', overflowX: 'hidden'}}>
        <Form  key='addAlarmForm'>
          <Row gutter={16}
               style={{marginLeft: '0.1%'}}>
            <Col span={22}>
              <Form.Item key="name" label="告警名称">
                <Input placeholder="输入告警名称" 
                       onBlur={event => {
                         props.data.name = event.target.value;
                       }}/>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item key="name" label="告警类型">
              <Select placeholder="请选择告警类型" >
                    <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item key="name" label="产品">
                <Select placeholder="请选择产品" >
                    <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Card style={{marginBottom: 10}} bordered={false} size="small">
            <p style={{fontSize: 16}}>触发条件
              <Tooltip title="触发条件满足条件中任意一个即可触发">
                <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
              </Tooltip>
              <Switch key='shakeLimit.enabled' checkedChildren="开启防抖" unCheckedChildren="关闭防抖"
                      defaultChecked={shakeLimit.enabled ? shakeLimit.enabled : false}
                      style={{position:'relative',left:'400px'}}
                      onChange={(value: boolean) => {
                        shakeLimit.enabled = value;
                        setShakeLimit({...shakeLimit})
                      }}
              />
              {shakeLimit.enabled && (
                <div style={{width:'600px',
                  display:'flex',
                  alignItems:'center',
                  paddingTop:'10px',
                  letterSpacing:'1px'
                }}>
                  <Input style={{width: 80}} key='shakeLimit.time'
                         defaultValue={shakeLimit.time}
                         onBlur={event => {
                           shakeLimit.time = event.target.value;
                         }}
                  />
                  <div style={{padding:'0 12px'}}>秒内发生</div>
                  <Input style={{width: 80}}  key='shakeLimit.threshold' defaultValue={shakeLimit.threshold}
                         onBlur={event => {
                           shakeLimit.threshold = event.target.value;
                         }}
                  />
                  <div style={{padding:'0 12px'}}>次及以上时,处理</div>
                  <Radio.Group defaultValue={shakeLimit.alarmFirst} key='shakeLimit.alarmFirst' 
                               onChange={event => {
                                 shakeLimit.alarmFirst = Boolean(event.target.value);
                               }}
                  >
                    <Radio.Button value={true}>第一次</Radio.Button>
                    <Radio.Button value={false}>最后一次</Radio.Button>
                  </Radio.Group>
                </div>
              )}
            </p>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 14px' }}>
            {trigger.map((item: any, index) => (
              <div key={index}>
                <Triggers
                  save={(data: any) => {
                    trigger.splice(index, 1, data);
                  }}
                  trigger={item}
                  key={`trigger_${Math.round(Math.random() * 100000)}`}
                  metaData={props.metaData}
                  position={index}
                  remove={(position: number) => {
                    trigger.splice(position, 1);
                    let data = [...trigger];
                    setTrigger([...data]);
                  }}
                />
              </div>
            ))}
            <Button icon="plus" type="dashed"
                    style={{width:'540px',position:'relative',left:5}}
                    onClick={() => {
                      setTrigger([...trigger, {_id: Math.round(Math.random() * 100000)}]);
                    }}
            >
              新增触发器
            </Button>
            </div>
            
            
          </Card>
          <Card style={{marginBottom: 10}} bordered={false} size="small">
            <p style={{fontSize: 16}}>转换
              <Tooltip title="将内置的结果字段转换为自定义字段，例如：deviceId 转为 id">
                <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
              </Tooltip>
            </p>
            <div style={{
              maxHeight: 200,
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.02)',
              paddingTop: 10,
            }}>
              {properties.map((item: any, index) => (
                <Row gutter={16}
                     style={{paddingBottom: 10, marginLeft: 13, marginRight: 3}}>
                  <Col span={11}>
                    <Input placeholder="请输入属性" value={item.property}
                           onChange={event => {
                             properties[index].property = event.target.value;
                             setProperties([...properties]);
                           }}
                    />
                  </Col>
                  <Col span={11}>
                    <Input placeholder="请输入别名" value={item.alias}
                           onChange={event => {
                             properties[index].alias = event.target.value;
                             setProperties([...properties]);
                           }}
                    />
                  </Col>
                  <Col span={2} style={{textAlign: 'right',  paddingRight: 15}}>
                    <Button type="link" 
                       onClick={() => {
                         removeProperties(index);
                       }}><DeleteOutlined style={{width:16,height:16}} /></Button>
                  </Col>
                </Row>
              ))}
              <Col span={24} style={{marginBottom:'5px',position:'relative',left:'20px'}}>
                <Button icon="plus" type="dashed"
                    style={{width:'540px'}}
                    onClick={() => {
                      setProperties([...properties, {_id: Math.round(Math.random() * 100000)}]);
                    }}
            >
              添加
            </Button>


              </Col>
            </div>
          </Card>

          <Card bordered={false} size="small" style={{ marginBottom: 10}}>
            <p style={{fontSize: 16}}>执行动作</p>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 14px' }}>
            {action.map((item: any, index) => (
              <ActionAssembly
                save={(actionData: any) => {
                  action.splice(index, 1, actionData);
                }}
                key={`action_${Math.round(Math.random() * 100000)}`}
                action={item}
                position={index}
                remove={(position: number) => {
                  action.splice(position, 1);
                  let data = [...action];
                  setAction([...data]);

                }}/>
            ))}
            <Button icon="plus" type="dashed"
            style={{width:'540px',position:'relative',left:10}}
                    onClick={() => {
                      setAction([...action, {_id: Math.round(Math.random() * 100000)}]);
                    }}
            >
              执行动作
            </Button>
            </div>
            
          </Card>
        </Form>
      </div>
    </Modal>
  );
};

export default Form.create<Props>()(Edit);