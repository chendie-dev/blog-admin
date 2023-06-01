import { Card } from 'antd';
import { useEffect } from 'react';
import echarts from '../../utils/echarts';
import ReactEcharts from 'echarts-for-react'
import './index.scss'
import { Footer } from 'antd/es/layout/layout';
export default function Charts() {
  var option = {
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  };
  useEffect(() => {

  }, [])
  return (
    <>
      <div className='charts'>
        {/* <Card > */}
        {/* <ReactEcharts
          style={{ height: 200 }}
          echarts={echarts}
          option={option}
          notMerge={true}
          lazyUpdate={true}

        /> */}
        <h1>ddgo博客管理系统</h1>
        {/* </Card> */}

      </div>
      
    </>
  )
}
