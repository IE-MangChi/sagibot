//코드 자동정렬 Control + Shift + B To.do 오류 로깅, name find 로직 목록 분기타는거 수정

const SQLite = require('SQLite'); // SQLite 모듈 불러오기
const sdcard = android
    .os
    .Environment
    .getExternalStorageDirectory()
    .getAbsolutePath();
const dbPath = sdcard + "/Boss/boss.db"

// SQLite 테스트 함수
function testSQLite() {
    const sql = new SQLite();

    try {
        // 데이터베이스 열기
        sql.open(dbPath);

        // 테이블 생성 (테이블이 없으면 생성)
        sql.query(
            "CREATE TABLE IF NOT EXISTS boss_team (team_name TEXT, date_time TEXT, creator " +
            "TEXT, boss_name TEXT, member1 TEXT, member2 TEXT, member3 TEXT, member4 TEXT, " +
            "member5 TEXT, member6 TEXT, member7 TEXT, member8 TEXT, member9 TEXT, member10" +
            " TEXT, memo TEXT);"
        );

    } catch (e) {
        return "SQLite 테스트 중 오류 발생: " + e; // 오류 메시지 출력
    } finally {
        if (result) result.close();
        sql.close();
    }
}

//-------------------삭제 함수 정의----------------------- 전체 팀 명단 삭제 함수
function deleteAllTeamsFromSQLite() {
    const sql = new SQLite();

    try {
        sql.open(dbPath);

        // 전체 팀 삭제
        sql.query("DELETE FROM boss_team;");

        return "모든 팀이 삭제되었습니다.";

    } catch (e) {
        replier.reply("[ERROR-CODE : DELETE_ALL_TEAM]");
        return 0;
    } finally {
        sql.close();
    }
}

// 해당하는 팀 삭제 함수
function deleteOneTeam(teamName, creator) {
    const sql = new SQLite();
    try {
        sql.open(dbPath);
        // 해당하는 팀 삭제 To.do 조건에 날짜 필터링 추가 예정
        const query = "delete from boss_team where creator = ? and team_name = ? and (date_time > date" +
                "time('now','localtime') or date_time = '미정');";
        const params = [creator, teamName];
        sql
            .db
            .execSQL(query, params);
        sql.close(); // 데이터베이스 닫기
    } catch (e) {
        replier.reply("[ERROR-CODE : DELETE_TEAM]");
        return 0;
    } finally {
        sql.close();
    }
}

//-------------------삽입, 업데이트 함수 정의----------------------- 해당하는 팀 조인 함수
function addMemo(teamName, memo, nickName, replier) {
    const sql = new SQLite();
    try {
        sql.open(dbPath);

        // 해당하는 팀에 조인 To.do 조건에 날짜 필터링 추가 예정
        const query = "update boss_team set memo = ? wher" +
                "e team_name = ? and creator = ? and (date_time > datetime('now','localtime') or date_time = '미정');";
        const params = [memo, teamName, nickName];
        sql
            .db
            .execSQL(query, params);
    } catch (e) {
        replier.reply("[ERROR-CODE : ADD_MEMO]");
        return 0;
    } finally {
        sql.close();
    }
}

function joinTeam(teamName, number, nickName, replier) {
    const sql = new SQLite();
    try {
        sql.open(dbPath);
        const allowedColumns = [
            "member1",
            "member2",
            "member3",
            "member4",
            "member5",
            "member6",
            "member7",
            "member8",
            "member9",
            "member10"
        ];
        // 해당하는 팀에 조인 To.do 조건에 날짜 필터링 추가 예정
        const query = "update boss_team set " + allowedColumns[number - 1] + " = ? wher" +
                "e team_name = ? and (date_time > datetime('now','localtime') or date_time = '미정');";
        const params = [nickName, teamName];
        sql
            .db
            .execSQL(query, params);
    } catch (e) {
        replier.reply("[ERROR-CODE : UPDATE_MEMBER]");
        return 0;
    } finally {
        sql.close();
    }
}

// 팀 명단 저장 함수 (SQLite 사용)
function saveTeamToSQLite(
    teamName,
    dateTime,
    creator,
    bossName,
    members,
    memo,
    replier
) {
    const sql = new SQLite();
    try {
        sql.open(dbPath);
        // 파라미터 배열을 수동으로 처리
        const query = "INSERT INTO boss_team (team_name, date_time, creator, boss_name, member1, memb" +
                "er2, member3, member4, member5, member6, member7, member8, member9, member10, " +
                "memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        // 파라미터 배열 만들기
        const params = [
            teamName,
            dateTime,
            creator,
            bossName,
            members[0],
            members[1],
            members[2],
            members[3],
            members[4],
            members[5],
            members[6],
            members[7],
            members[8],
            members[9],
            memo
        ];

        // 수동으로 파라미터 바인딩
        sql
            .db
            .execSQL(query, params);

    } catch (e) {
        replier.reply("[ERROR-CODE : INSERT_TEAM]");
        return 0;
    } finally {
        sql.close();
    }
}

// 팀 시간 지정 함수
function saveTeamTime(teamName, date, sender, replier) {
    const sql = new SQLite();
    try {
        sql.open(dbPath);
        // To.do 조건에 날짜 필터링 추가 예정
        const query = "update boss_team set date_time = ? where team_name = ? and creator = ? and (dat" +
                "e_time > datetime('now','localtime') or date_time = '미정');";
        const params = [date, teamName, sender];
        sql
            .db
            .execSQL(query, params);
    } catch (e) {
        replier.reply("[ERROR-CODE : UPDATE_TIME]");
        return 0;
    } finally {
        sql.close();
    }
}

//-------------------조회 함수 정의----------------------- 전체 팀 명단 조회 함수
function getAllTeamsFromSQLite(replier, boolean) {
    const sql = new SQLite();

    try {
        sql.open(dbPath);

        // 모든 팀 정보 조회
        const result = sql.query(
            "SELECT * FROM boss_team where 1=1 and (date_time > datetime('now','localtime') or date_time = '미정');"
        );

        //boolean = false -> 팀명만 조회
        if (!boolean) {
            let teamArray = [
                "사기1팀",
                "사기2팀",
                "사기3팀",
                "사기4팀",
                "사기5팀",
                "사기6팀",
                "사기7팀"
            ];
            while (result.moveToNext()) {
                let index = teamArray.indexOf(result.getString(0));
                if (index !== -1) {
                    teamArray.splice(index, 1);
                }
            }
            return teamArray;
        }

        let output = "";
        let rowCount = 0;

        while (result.moveToNext()) {
            rowCount++;
            output += "┏ ⌬ 현재 개설된 명단 목록\n"
            output += "┣━━━━━━━━━━━━━━\n";
            output += "┃팀   명: " + result.getString(0) + "\n";
            output += "┃보   스: " + result.getString(3) + "\n";
            if (result.getString(1) === "미정") {
                output += "┃날   짜: 미정\n";
                output += "┃시   간: 미정\n";
            } else {
                var dayArray = parseDateToArray(result.getString(1));
                output += "┃날   짜: " + dayArray[0] + " " + dayArray[1] + " " + dayArray[2] + "\n";
                output += "┃시   간: " + String(dayArray[3]).padStart(3, '0') + " " + String(dayArray[4]).padStart(3, '0') + "\n";
            }
            output += "┃생성자: " + result.getString(2) + "\n";
            output += "┃1. " + result.getString(4) + "\n";
            output += "┃2. " + result.getString(5) + "\n";
            output += "┃3. " + result.getString(6) + "\n";
            output += "┃4. " + result.getString(7) + "\n";
            output += "┃5. " + result.getString(8) + "\n";
            output += "┃6. " + result.getString(9) + "\n";
            output += "┃7. " + result.getString(10) + "\n";
            output += "┃8.(맆) " + result.getString(11) + "\n";
            output += "┃9.(은) " + result.getString(12) + "\n";
            output += "┃10.(숍)" + result.getString(13) + "\n";
            output += "┣━━━━━━━━━━━━━━\n"
            output += "┃📢" + result.getString(14) + "\n";
            output += "┗━━━━━━━━━━━━━━\n"
        }

        if (rowCount === 0) {
            output = "명단이 존재하지 않습니다.";
        }

        return output.slice(0, -1);

    } catch (e) {
        replier.reply("[ERROR-CODE : SELECT_ALL_TEAM2]")
        return 0;
    } finally {
        if (result) result.close();
        sql.close();
    }
}

// (단일 팀 명단 조회 함수 데이터 검증 함수) input : teamName, replier, boolean return : 오류 ->
// 0, 성공 -> output
// ------------------------------------
//input : teamName, replier, string return : 오류 -> 0, 성공 -> output
function getTeamsFromSQLite(teamName, replier, boolean) {
    const sql = new SQLite();
    if (typeof boolean === "string") {
        try {
            sql.open(dbPath);
            const result = sql.query(
                "SELECT * FROM boss_team where team_name = '" + teamName +
                "' and creator = '" + boolean +
                "' and (date_time > datetime('now','localtime') or date_time = '미정');"
            );
            let output = "";
            let rowCount = 0;

            while (result.moveToNext()) {
                rowCount++;
            }

            if (rowCount === 0) {
                output = 3;
            }

            return output;
        } catch (e) {
            replier.reply("[ERROR-CODE : SELECT_ANY_TEAM_OF_CREATOR]");
            return 0;
        } finally {
            if (result) result.close();
            sql.close();
        }
    }

    try {

        sql.open(dbPath);
        // 특정 팀 정보 조회
        const result2 = sql.query(
            "SELECT * FROM boss_team WHERE team_name = '" + teamName + "' AND (date_time > datetime('now','localtime') or date_time = '미정');"
        );
        let output2 = "┏ ❖ System\n";
        output2 += "┣━━━━━━━━━━━━━━\n";
        let rowCount2 = 0;

        while (result2.moveToNext()) {
            rowCount2++;
            output2 += "┃["+result2.getString(0) + "] 설정완료\n";
            output2 += "┣━━━━━━━━━━━━━━\n"
            output2 += "┃팀   명: " + result2.getString(0) + "\n";
            output2 += "┃보   스: " + result2.getString(3) + "\n";
            if (result2.getString(1) === "미정") {
                output2 += "┃날   짜: 미정\n";
                output2 += "┃시   간: 미정\n";
                output2 += "┃생성자: " + result2.getString(2) + "\n";
            } else {
                var dayArray = parseDateToArray(result2.getString(1));
                output2 += "┃날   짜: " + dayArray[0] + " " + dayArray[1] + " " + dayArray[2] + "\n";
                output2 += "┃시   간: " + String(dayArray[3]).padStart(3, '0') + " " + String(dayArray[4]).padStart(3, '0') + "\n";
                output2 += "┃생성자: " + result2.getString(2) + "\n";
            }
            if (boolean) {
                output2 += "┃1. " + result2.getString(4) + "\n";
                output2 += "┃2. " + result2.getString(5) + "\n";
                output2 += "┃3. " + result2.getString(6) + "\n";
                output2 += "┃4. " + result2.getString(7) + "\n";
                output2 += "┃5. " + result2.getString(8) + "\n";
                output2 += "┃6. " + result2.getString(9) + "\n";
                output2 += "┃7. " + result2.getString(10) + "\n";
                output2 += "┃8.(맆) " + result2.getString(11) + "\n";
                output2 += "┃9.(은) " + result2.getString(12) + "\n";
                output2 += "┃10.(숍)" + result2.getString(13) + "\n";
                output2 += "┣━━━━━━━━━━━━━━\n"
                output2 += "┃📢" + result2.getString(14) + "\n";
            }
            output2 += "┗━━━━━━━━━━━━━━\n"
        }

        if (rowCount2 == 0) {
            output2 = 1;
        }

        if (output2 == 1) {
            return output2;
        }

        return output2.slice(0, -1);

    } catch (e) {
        replier.reply("[ERROR-CODE : SELECT_ANY_TEAM]");
        return 0;
    } finally {
        if (result2) result2.close();
        sql.close();
    }
}

// 해당 자리에 사용자가 있는지 조회하는 함수
function checkMemberInTeam(teamName, memberNumber, replier) {
    // 쓰진않는데 무슨 기능이더라..
    const sql = new SQLite();

    try {
        sql.open(dbPath);
        // `memberNumber`를 기반으로 컬럼 이름 생성
        const memberColumn = "member" + memberNumber;

        const result1 = sql.query(
            "SELECT " + memberColumn + " FROM boss_team where team_name = '" + teamName + "' and (date_time > datetime('now','localtime') or date_time = '미정');"
        );

        var boolean1 = "";
        let rowCount1 = 0

        while (result1.moveToNext()) {
            rowCount1++;
            const currentMember1 = result1.getString(0); // 해당 member 컬럼의 값 가져오기
            if (currentMember1 !== "" && currentMember1 != null) {
                boolean1 = currentMember1;
            };
        }
        if (rowCount1 == 0) {
            boolean1 = 1;
        }
        return boolean1;

    } catch (e) {
        replier.reply("[ERROR-CODE : CHECK_MEMBER_IN_TEAM2]");
        return 0;
    } finally {
        if (result1) result1.close();
        sql.close();
    }
}

// -------------------Utile 함수 정의----------------------- (시간 데이터 검증 함수) input :
// 날짜데이터 return 잘못된값 -> null, 정상값 -> YY-MM-DD HH:MM:SS 객체 반환
function validateAndTransform(dayOfWeek, timePart) {
    // 요일 문자열 검증
    const daysMap = {
        "일요일": 0,
        "월요일": 1,
        "화요일": 2,
        "수요일": 3,
        "목요일": 4,
        "금요일": 5,
        "토요일": 6
    };

    if (!(dayOfWeek in daysMap) || isNaN(parseInt(timePart, 10))) {
        return null;
    }

    if (timePart.length !== 4) {
        return null;
    }

    const hour = parseInt(timePart.slice(0, 2), 10);
    const minute = parseInt(timePart.slice(2, 4), 10);

    // 시, 분 범위 검증
    if (hour < 0 || hour > 23) {
        return null;
    }
    if (minute < 0 || minute > 59) {
        return null;
    }

    // 현재 날짜와 요일 계산
    const now = new Date();
    const koreaNow = new Date(now.getTime());
    const koreaOffset = 9 * 60 * 60 * 1000; // UTC+9
    const currentDayOfWeek = koreaNow.getDay(); // 0(일요일) ~ 6(토요일)
    const targetDayOfWeek = daysMap[dayOfWeek];
    let daysUntilTarget = targetDayOfWeek - currentDayOfWeek;
    // 동일 요일 처리
    if (daysUntilTarget === 0) {
        // 시간이 현재 시각보다 작다면 다음 주로 이동
        if (hour <= koreaNow.getHours() && minute <= koreaNow.getMinutes()) {
            daysUntilTarget += 7;
        }
    } else {
        // 다른 요일이 이전 요일이라면 다음 주로 이동
        daysUntilTarget += 7;
    }

    if (daysUntilTarget%7 !== 0) {
        daysUntilTarget = daysUntilTarget%7;
    }

    // 목표 날짜와 시간 계산
    const targetDate = new Date(
        koreaNow.getFullYear(),
        koreaNow.getMonth(),
        koreaNow.getDate() + daysUntilTarget,
        hour,
        minute,
        0
    );
    // UTC로 변환하여 SQLite 형식으로 변환
    const sqliteDate = new Date(targetDate.getTime() + koreaOffset)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    return sqliteDate;
}



// 1~10 번호 검증 로직
function isValidNumber(input) {
    // 숫자인지 확인
    if (typeof input == "number") {
        return true;
    }
    // 1~10 사이 값인지 확인
    return input >= 1 && input <= 10;
}

function parseDateToArray(dateString) {
    // 날짜 문자열 분리
    const parts = dateString.split(/[- :]/); // 연, 월, 일, 시, 분
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 월은 0부터 시작하므로 1을 빼줌
    const day = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);

    // Date 객체 생성
    const date = new Date(year, month, day, hour, minute);

    // 요일 배열
    const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    // 월 배열
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const result = [
        weekdays[date.getDay()],           // 요일
        months[date.getMonth()],           // 월
        date.getDate() + "일",             // 일
        date.getHours() + "시",             // 시
        date.getMinutes() + "분"            // 분
    ];

    return result;
}

// 사용자 상태를 저장할 객체
const status = {};

function response(
    room,
    msg,
    sender,
    isGroupChat,
    replier,
    imageDB,
    packageName
) {
    if (room != "사기길드 보스명단") {
        return;
    }

    if (!status[sender]) {
        status[sender] = "default"; // 초기 상태 설정
    }
    const action = status[sender].split(" ");
    switch (action[0]) {
        case 'deleteAll-confirmation':
            {
                if (msg === "확인") {
                    const deleteAllResult = deleteAllTeamsFromSQLite(); // 전체 삭제
                    //에러발생 [ERROR-CODE : DELETE_ALL_TEAM]
                    if (deleteAllResult === 0) {
                        return;
                    }
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━\n"+
                        "┃전체삭제 완료\n"+
                        "┗━━━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else if (msg === "취소") {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━\n"+
                        "┃전체삭제 취소\n"+
                        "┗━━━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━━━━━━━\n"+
                        "┃잘못된 입력입니다.\n"+
                        "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                        "┗━━━━━━━━━━━━━━"
                    )
                }
                break;
            }

            //To.do 이거 고르게할때 setTimeOut으로 시간 지나면 return 시켜버려야할듯;
        case 'delete-confirmation':
            {
                if (msg == "확인") {
                    // 이런거 리턴에 넣어야할듯?
                    const deleteOneTeamResult = deleteOneTeam(action[1], sender);
                    //에러발생 [ERROR-CODE : DELETE_TEAM]
                    if (deleteOneTeamResult === 0) {
                        return;
                    }
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━\n"+
                        "┃삭제 완료\n"+
                        "┗━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else if (msg === "취소") {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━\n"+
                        "┃삭제 취소\n"+
                        "┗━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━━━━━━━\n"+
                        "┃ 잘못된 입력입니다.\n"+
                        "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                        "┗━━━━━━━━━━━━━━"
                    );
                }
                break;
            }

        case 'joinTeam-confirmation':
            {
                if (msg == "확인") {
                    const joinTeamResult2 = joinTeam(action[1], action[2], action[3], replier);
                    //에러발생 [ERROR-CODE : UPDATE_MEMBER]
                    if (joinTeamResult2 === 0) {
                        return;
                    }
                    const resultForJoin2 = getTeamsFromSQLite(action[1], replier, true);
                    //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                    if (resultForJoin2 === 0) {
                        return;
                    }
                    replier.reply(resultForJoin2);
                    status[sender] = 'default'; // 상태 리셋
                } else if (msg === "취소") {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━\n"+
                        "┃참여 취소\n"+
                        "┗━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━━━━━━━\n"+
                        "┃ 잘못된 입력입니다.\n"+
                        "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                        "┗━━━━━━━━━━━━━━"
                    );
                }
                break;
            }

        case 'getOutTeam-confirmation':
            {
                if (msg === "확인") {
                    const getOutTeam = joinTeam(action[1], action[2], " ", replier);
                    //에러발생 [ERROR-CODE : UPDATE_MEMBER]
                    if (getOutTeam === 0) {
                        return;
                    }
                    const resultForOut = getTeamsFromSQLite(action[1], replier, true);
                    //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                    if (resultForOut === 0) {
                        return;
                    }
                    replier.reply(resultForOut);
                    status[sender] = 'default'; // 상태 리셋
                } else if (msg === "취소") {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━\n"+
                        "┃빠지기 취소\n"+
                        "┗━━━━━━"
                    );
                    status[sender] = 'default'; // 상태 리셋
                } else {
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━━━━━━━\n"+
                        "┃잘못된 입력입니다.\n"+
                        "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                        "┗━━━━━━━━━━━━━━"
                    );
                }
                break;
            }

        case 'update-memo-confirmation':
            {
                if (msg === "취소") {
                    status[sender] = 'default'; //상태리셋
                    replier.reply(
                        "┏ ❖ System\n"+
                        "┣━━━━━━━━━━━━━━\n"+
                        "┃메모 추가가 취소됨\n"+
                        "┗━━━━━━━━━━━━━━"
                    )
                } else {
                    const addMemoResult = addMemo(action[1], msg, sender, replier);
                    //에러발생 [ERROR-CODE : ADD_MEMO]
                    if (addMemoResult === 0) {
                        return;
                    }
                    const resultForMemo = getTeamsFromSQLite(action[1], replier, true);
                    //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                    if (resultForMemo === 0) {
                        return;
                    }
                    replier.reply(resultForMemo);
                    status[sender] = 'default'; // 상태 리셋
                }
                break;
            }

        case 'default':
        default:
            {
                const cmd = msg.split(" ");
                switch (cmd[0]) {
                    case "/목록":
                        if (cmd.length != 1) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex) /목록\n"+
                                "┗━━━━━━━━━━━━━━"
                            )
                            return;
                        }
                        const allTeams = getAllTeamsFromSQLite(replier, true);
                        //에러발생 [ERROR-CODE : SELECT_ALL_TEAM]
                        if (allTeams === 0) {
                            return;
                        }
                        replier.reply(allTeams);
                        break;

                    case "/참여":
                        if (cmd.length != 4) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex)/참여 [팀이름] [번호] [닉네임]\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }

                        if (!isValidNumber(cmd[2])) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃번호는 1~10까지만 입력가능합니다.\n"+
                                "┗━━━━━━━━━━━━━━"
                                );
                            break;
                        }

                        const checkMemberAndTeam = checkMemberInTeam(cmd[1], cmd[2], replier);
                        //에러발생 [ERROR-CODE : CHECK_MEMBER_IN_TEAM]
                        if (checkMemberAndTeam === 0) {
                            return;
                        }

                        if (checkMemberAndTeam === 1) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃해당 팀이 존재하지 않습니다.\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }

                        if (typeof checkMemberAndTeam === "string" && checkMemberAndTeam !== "") {
                            status[sender] = 'joinTeam-confirmation ' + cmd[1] + " " + cmd[2] + " " + cmd[3];
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃"+checkMemberAndTeam+ "님의 자리입니다.\n"+
                                "┃그래도 진행하시겠습니까?\n"+
                                "┃'확인' 또는 '취소'로 응답해주세요.\n"+
                                "┗━━━━━━━━━━━━━━"
                                )
                            break;
                        }
                        //이미 참여한 파티인지 확인 <<-- 이건 필요없을듯

                        const joinTeamResult = joinTeam(cmd[1], cmd[2], cmd[3], replier);
                        //에러발생 [ERROR-CODE : UPDATE_MEMBER]
                        if (joinTeamResult === 0) {
                            return;
                        }
                        const resultForJoin = getTeamsFromSQLite(cmd[1], replier, true);
                        //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                        if (resultForJoin === 0) {
                            return;
                        }
                        replier.reply(resultForJoin);
                        break;

                    case "/빠지기":
                        if (cmd.length != 3) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex) /빠지기 [팀이름] [번호]\n"+
                                "┗━━━━━━━━━━━━━━"
                                );
                            return;
                        }

                        if (!isValidNumber(cmd[2])) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃번호는 1~10까지만 입력가능합니다.\n"+
                                "┗━━━━━━━━━━━━━━");
                            break;
                        }
                        const checkMemberAndTeam2 = checkMemberInTeam(cmd[1], cmd[2], replier);

                        //에러발생 [ERROR-CODE : CHECK_MEMBER_IN_TEAM]
                        if (checkMemberAndTeam2 === 0) {
                            return;
                        }
                        if (checkMemberAndTeam2 === 1) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃해당 팀이 존재하지 않습니다.\n"+
                                "┗━━━━━━━━━━━━━━");
                            return;
                        }
                        if (typeof checkMemberAndTeam2 === "string" && checkMemberAndTeam !== "") {
                            status[sender] = 'getOutTeam-confirmation ' + cmd[1] + " " + cmd[2];
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃"+checkMemberAndTeam2+ "님의 자리입니다.\n"+
                                "┃그래도 빼겠습니까?\n"+
                                "┃'확인' 또는 '취소'로 응답해주세요.\n"+
                                "┗━━━━━━━━━━━━━━"
                            )
                            break;
                        }
                        replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃비어있는 자리입니다.\n"+
                                "┗━━━━━━━━━━━━━━"
                        );
                        break;

                    case "/생성":
                        if (cmd.length != 2) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex)/명단생성 [보스이름]\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }
                        const bossName = cmd[1]; // 보스이름
                        //사용 가능한 팀 이름 찾는 로직
                        const canUseTeamName = getAllTeamsFromSQLite(replier, false);
                        const teamName = canUseTeamName[0];
                        const members = [
                            sender,
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]; // 10명 멤버 배열 초기화
                        const creator = sender;

                        // saveTeamToSQLite(teamName, "", creator, bossName, members, "");  SQLite에 저장
                        const saveTeamResult = saveTeamToSQLite(
                            teamName,
                            "미정",
                            creator,
                            bossName,
                            members,
                            "",
                            replier
                        ); // SQLite에 저장
                        //에러발생 [ERROR-CODE : INSERT_TEAM]
                        if (saveTeamResult === 0) {
                            return;
                        }
                        const teamListForMake = getTeamsFromSQLite(teamName, replier, false);
                        //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                        if (teamListForMake === 0) {
                            return;
                        }
                        replier.reply("" + teamListForMake);
                        break;

                    case "/시간":
                        if (cmd.length != 4) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex)/시간 사기1팀 목요일 1530\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }
                        const validatedDate = validateAndTransform(cmd[2], cmd[3]);
                        if (validatedDate === null) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃시간을 형식에 맞게 입력해주세요.\n"+
                                "┃ex)/시간 사기1팀 목요일 1530\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }
                        //생성자가 맞는지 확인 로직
                        const creatorCheck = getTeamsFromSQLite(cmd[1], replier, sender);
                        if (creatorCheck === 3) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃해당 팀이 없거나 권한이 없습니다.\n"+
                                "┗━━━━━━━━━━━━━━");
                            return;
                        }

                        const update_time = saveTeamTime(cmd[1], validatedDate, sender, replier);
                        //에러발생 [ERROR-CODE : UPDATE_TIME]
                        if (update_time === 0) {
                            return;
                        }
                        const resultForTime = getTeamsFromSQLite(cmd[1], replier, false);
                        //에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                        if (resultForTime === 0) {
                            return;
                        }
                        if (creatorCheck === 1) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃해당 팀이 없거나 권한이 없습니다.\n"+
                                "┗━━━━━━━━━━━━━━");
                            return;
                        }
                        replier.reply(resultForTime);
                        break;

                    case "/메모":
                        if (cmd.length != 2) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex) /메모 [팀이름]\n"+
                                "┗━━━━━━━━━━━━━━"
                            )
                            return;
                        }

                        const teamNameForMemo = getTeamsFromSQLite(cmd[1], replier, sender);
                        // 에러로직 [ERROR-CODE : SELECT_ANY_TEAM_OF_CREATOR]
                        if (teamNameForMemo === 0) {
                            return;
                        }

                        if (teamNameForMemo === 3) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃해당 팀이 존재하지않거나 권한이 없습니다.\n"+
                                "┗━━━━━━━━━━━━━━"
                            )
                            return;
                        }
                        // 정상로직
                        status[sender] = 'update-memo-confirmation ' + cmd[1];
                        replier.reply(
                            "┏ ❖ System\n"+
                            "┣━━━━━━━━━━━━━━\n"+
                            "┃기입할 메모를 입력해주세요\n"+
                            "┃취소하려면 '취소' 입력해주세요\n"+
                            "┗━━━━━━━━━━━━━━"
                        );
                        break;
                        

                    case "/전체삭제":
                        replier.reply(
                            "┏ ❖ System\n"+
                            "┣━━━━━━━━━━━━━━\n"+
                            "┃권한이 없습니다. Only DDONG\n"+
                            "┗━━━━━━━━━━━━━━"
                        )
                        // status[sender] = 'deleteAll-confirmation';
                        // replier.reply(
                        //     "┏ ❖ System\n"+
                        //     "┣━━━━━━━━━━━━━━\n"+
                        //     "┃ 정말로 모든 데이터를 삭제하시겠습니까?\n"+
                        //     "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                        //     "┗━━━━━━━━━━━━━━"
                        // );
                        break;

                    case "/삭제":
                        if (cmd.length != 2) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃형식에 맞게 입력해주세요.\n"+
                                "┃ex) /삭제 [팀이름]\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }
                        const teamListForRemove = getTeamsFromSQLite(cmd[1], replier, sender);
                        //에러발생 에러발생 [ERROR-CODE : SELECT_ANY_TEAM]
                        if (teamListForRemove === 0) {
                            return;
                        }

                        if (teamListForRemove == 1 || teamListForRemove == 3) {
                            replier.reply(
                                "┏ ❖ System\n"+
                                "┣━━━━━━━━━━━━━━\n"+
                                "┃삭제할 팀이 없거나 권한이 없습니다.\n"+
                                "┗━━━━━━━━━━━━━━"
                            );
                            return;
                        }

                        status[sender] = 'delete-confirmation ' + cmd[1];
                        replier.reply(
                            "┏ ❖ System\n"+
                            "┣━━━━━━━━━━━━━━\n"+
                            "┃ 정말로 데이터를 삭제하시겠습니까?\n"+
                            "┃'확인' 또는 '취소'로만 응답해주세요.\n"+
                            "┗━━━━━━━━━━━━━━"
                        );
                        break;
                }
            }
    }
}
