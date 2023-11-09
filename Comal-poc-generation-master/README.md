# Comal PoC 生成工具

根据 p师傅 https://github.com/phith0n/xray-poc-generation/tree/master 项目改变而来
在原版的基础上将poc的生成格式修改为Comall格式

增加了poc的模版参考选项，并配套相关的注释，以便于更好的理解去编写poc


## 快速使用
* git clone https://github.com/vulai-huaun/VTI-comal.git
* cd VTI-comal/Comal-poc-generation-master
* yarn
* yarn build

就会在当前文件夹下生成build目录，进入后开启web服务即可使用
```python
python3 -m http.server 8888

```
最终生成界面如下：
![](https://cdn.jsdelivr.net/gh/h0ld1rs/image/image202311092003877.png)

## Todo list
  * 增加yaml 格式验证
  * 增加 http 请求预览
* 增加更复杂的yaml编写demo

有更多需求/建议，请提交issue