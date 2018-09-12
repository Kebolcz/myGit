import React from 'react';
import { NavBar, Icon, InputItem } from 'antd-mobile';
import AvatarSelector from '../../conponent/avatar-selector/avatar-selector';

class BossInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }

  onChange(key, val) {
    this.setState({
      [key]: val
    })
  }

  render() {
    return (
    <div>
      <NavBar mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() => console.log('onLeftClick')}
      >BossInfo</NavBar>
      <AvatarSelector></AvatarSelector>
      <InputItem onChange={(v)=>{this.onChange('title',v)}}>招聘职位</InputItem>
      <InputItem onChange={(v)=>{this.onChange('title',v)}}>公司名称</InputItem>
      <InputItem onChange={(v)=>{this.onChange('title',v)}}>职位薪资</InputItem>
      <InputItem onChange={(v)=>{this.onChange('title',v)}}>职位要求</InputItem>
    </div>
    )
  }
}

export default BossInfo;