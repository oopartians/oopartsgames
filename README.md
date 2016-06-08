# OOpartsgames

**OOPARTSGames는 한양대 게임개발동아리 OOPARTS에서 만든 HTML기반 게임 플레이용 홈페이지입니다.**  

## 목적
- HTML기반의 게임 제작시 회원관리, 방관리 등의 여러 기능을 제공하여 게임 제작의 생산성 향상 
- Nodejs 및 여러 오픈소스 경험
- 동아리 홍보
- 동아리원이 다같이 즐길 수 있는 게임 개발
- 플랫폼에 의존되지 않아 PC, 모바일에서 전부 즐길 수 있는 게임 제작

## nodejs, npm install
``` bash
$ sudo apt-get install npm
$ sudo apt-get install nodejs
```

## Server install
``` bash
$ git clone https://github.com/oopartians/oopartsgames.git
$ cd oopartsgames
$ npm install
```

## Database install
``` bash
$ sudo apt-get install mariadb-server
$ mysql -u root -p
> create database oopartsgames;
> alter database oopartsgames character set utf8 collate utf8_general_ci;
> create user 'oopartsgames'@'localhost' identified by 'ooparts';
> grant all privileges on oopartsgames.* to 'oopartsgames'@'localhost' identified by 'ooparts';
> exit
```

## Run
``` bash
$ sudo npm start
```
