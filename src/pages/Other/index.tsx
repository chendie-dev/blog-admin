import './index.scss'
export default function Other() {
    return (
        <div className='other'>
            <p className="other__title">看板界面</p>
            <div className="images">
                <img onClick={()=>{window.location.href="http://8.130.107.218:28087"}} src={require('../../images/bd27248f63dc8ac8bd165e34e6cf6e7c.png')} alt="actuator" style={{ width: '8%' }} />
                <img onClick={()=>{window.location.href="http://8.130.107.218:5601"}}src={require('../../images/elastic.png')}style={{ width: '50%' }} alt="kibana" />
                <img onClick={()=>{window.location.href="http://101.43.175.25:19000"}}src={require('../../images/ocmak.png')} style={{ width: '70%' }} alt="CMAK" />
                <img onClick={()=>{window.location.href="http://59.110.143.1:9411/zipkin/"}}src={require('../../images/zipkin.png')} alt="zipkin" />
                <img onClick={()=>{window.location.href="http://101.43.175.25:8848/nacos"}}src={require('../../images/nacos.png')} style={{ width: '18%' }} alt="nacos" />
            </div>
        </div>
    )
}
