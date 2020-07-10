---
title: mobxFormData Examples
order: 3
nav:
  title: Mobx Extension
  order: 3
toc: menu
---

<Alert>This chapter will be translated in English soon.</Alert>

# 表单示例

在此介绍使用`MobxFormData`操作`Ant Design Form`组件的一些代码演示示例。

## 基本使用

<code src="./demo/Demo1.tsx" />

## 表单方法调用

通过`formData`实例对表单数据域进行交互。

<code src="./demo/Demo2.tsx" />

## 表单方法调用（Class component）

在`Class component`中的使用方法与`Function component`区别不大。

<code src="./demo/Demo3.tsx" />

## 动态增减表单项

动态增加、减少表单项。

<code src="./demo/Demo4" />

## 自定义校验信息

通过`validateMessages`自定义校验信息模板，模板内容可参考[此处](https://github.com/yiminghe/async-validator)。

<code src="./demo/Demo5" />

## 复杂一点的控件

这里演示`Form.Item`内有多个元素的使用方式。

<code src="./demo/Demo7" />

## 自定义表单控件

自定义或第三方的表单控件，也可以与`MobxFormData`一起使用。

<code src="./demo/Demo8" />

## 多表单联动

<code src="./demo/Demo11" />

## 表单数据存储于上层组件或 Store 中

`MobxFormData` 在组件外进行表单数据的传递或操作是非常容易的，它可以很方便地支持在上层组件或独立的 `Store` 内定义：

<code src="./demo/Demo12" />

## 时间类控件

时间类组件的 value 类型为 moment 对象，所以在提交服务器前需要预处理。

<code src="./demo/Demo9" />

## 动态校验规则

根据不同情况执行不同的校验规则。

<code src="./demo/Demo6" />

## 校验其他组件

以上演示没有出现的表单控件对应的校验演示。

<code src="./demo/Demo10" />
