# Welcome to Comal

> Huaun poc 测试工具

# 快速使用

在使用之前，请务必阅读并同意 License 文件中的条款，否则请勿安装使用本工具。

- -u： PoC测试目标 （必填）
- -p：测试使用的PoC （必填）
- -v：打印请求与响应
- -r: 回连IP
- -proxy：设置HTTP代理
- -version: 查看版本

## 基础使用命令（非回连poc使用案例）

```SQL
.\windows_amd64.exe -p .\CVE-2023-5360.yaml -u http://192.168.59.130
2023/10/20 18:20:08 Start
2023/10/20 18:20:08 PoC CVE-2023-5360(VUL-2023-13510) -> http://192.168.59.130
2023/10/20 18:20:11 Hit> CVE-2023-5360(VUL-2023-13510) http://192.168.59.130/
Detail:
nonce: 26d3e8beb4
info: 存在CVE-2023-5360文件上传漏洞
filename: gbzhrgdu
res:
 \___0: var WprConfig = {"ajaxurl":"http:\/\/192.168.59.130\/wp-admin\/admin-ajax.php","resturl":"http:\/\/192.168.59.130\/wp-json\/wpraddons\/v1","nonce":"26d3e8beb4"
 \___nonce: 26d3e8beb4
2023/10/20 18:20:11 Time: 2.582591s
```

- 如果您想清楚的看到你发送的请求和响应，可以使用 -v参数

```Bash
.\windows_amd64.exe -p .\CVE-2023-5360.yaml -u http://192.168.59.130 -v
2023/10/20 18:22:33 Start
2023/10/20 18:22:33 PoC CVE-2023-5360(VUL-2023-13510) -> http://192.168.59.130

---= 0 =-------------------------------------
[Request]
GET / HTTP/1.1
Host: 192.168.59.130
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0

[Response]
HTTP/1.1 200 OK
Connection: close
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8
Date: Fri, 20 Oct 2023 10:22:33 GMT
Link: <http://192.168.59.130/wp-json/>; rel="https://api.w.org/", <http://192.168.59.130/wp-json/wp/v2/pages/718>; rel="alternate"; type="application/json", <http://192.168.59.130/>; rel=shortlink
Server: Apache/2.4.39 (Win64) OpenSSL/1.1.1b mod_fcgid/2.3.9a mod_log_rotate/1.02
X-Powered-By: PHP/7.3.4

<!DOCTYPE html>
<html lang="zh-CN">
··· 略 ···
```

- 如果您想调试发送的数据包，推荐和Burpsuit 联动，加入 -proxy 设置代理

```Bash
.\windows_amd64.exe -p .\CVE-2023-5360.yaml -u http://192.168.59.130 -proxy http://127.0.0.1:8080
```

![](https://cdn.jsdelivr.net/gh/h0ld1rs/image/image202310211330952.png)

## 回连poc使用示例

使用-r参数指定回连地址的IP，comal会随机监听一个高端口用于检测回连，请注意开放防火墙规则

```SQL
.\windows_amd64.exe -p .\CVE-2021-2109.yaml -u http://127.0.0.1:7001 -r 192.168.59.1
2023/10/20 18:44:02 Start
2023/10/20 18:44:02 PoC CVE-2021-2109(VUL-2021-01439) -> http://127.0.0.1:7001
2023/10/20 18:44:08 NOT HIT> CVE-2021-2109(VUL-2021-01439)
2023/10/20 18:44:08 Time: 6.080046s
```

# 贡献poc

## 提交流程

1. 登录https://vti.huaun.com/index/   进行账号注册
2. 在 https://vti.huaun.com/sumbitVul 处进行poc提交，更详细的poc编写指南，请参考https://vti.huaun.com/html/poc%20%E7%BC%96%E5%86%99%E6%8C%87%E5%8D%97%20v1.0.pdf
3. 编写过程中，您可以下载相关的burp插件来辅助您进行编写，下载地址为：https://vti.huaun.com/html/comalExt.jar  （目前只支持burpsuit 2023 版本以上的，如果遇到burp插件加载错误，请尝试更换为burp2023版本，否则会遇到API 相关的报错）
4. 相关提交要求，请参考【漏洞提交页面】的【提交要求】
5. 详细PoC的定价标准，请参考：https://i8bbmkcybg.feishu.cn/docx/PP64deK2rowtluxyTLqcCGiDnuc?from=from_copylink
6. 请您提交的时候，准备好相关docker文件或者软件压缩包，并提供好相关运行成功的截图，这将影响到您最终的漏洞奖金。
7. 【重要】目前 Nday只收集【漏洞信息】中发布的漏洞， https://vti.huaun.com/Vulinfo 。其余提交均会驳回，请提交的时候注意。 未公开细节的 1day 和 0day 不限于此规则。 

## 奖励

本平台实行积分兑换制，1漏洞积分 = 价值 10rmb 的京东卡

面值为50 与 100。提交兑换申请之后，本月15日之前的，15日发放，15日之后的，次月15日发放。其他问题请联系相关人员。

## 交流

Comal 非常感谢各位师傅的支持，关于工具的bug、PoC赏金的换算比例、PoC的审核进度等问题，欢迎各位师傅一起加群交流讨论，如进群二维码失效，请各位师傅添加客服微信。

![](https://cdn.jsdelivr.net/gh/h0ld1rs/image/image202310211331587.png)

![](https://cdn.jsdelivr.net/gh/h0ld1rs/image/image202310211332701.png)

客服的个人微信：

![](https://cdn.jsdelivr.net/gh/h0ld1rs/image/image202310211334219.jpg)
