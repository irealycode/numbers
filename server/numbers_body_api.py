#!/usr/bin/python3
from ast import And
from crypt import methods
import json
from flask import Flask, request
from flask_cors import CORS
from itsdangerous import base64_encode, exc
from matplotlib import use
from optax import ema
import jwt
import hashlib
import random
from torch import rand
from markit_mail import sendEmail
import base64
import string
from pikadb import PikaDB_Script
app = Flask(__name__)
CORS(app)
private_key = "*******************************************************************************************************************************************************:90"
public_key = "***********************************************************:23"
                                # Signup
def get_random_string(length):
    lettersanddigits = string.ascii_lowercase+string.digits
    result_str = ''.join(random.choice(lettersanddigits) for i in range(length))
    return result_str

@app.route('/markit_hands_api', methods=['POST'])
def signup():
    data = json.loads(str(request.data.decode("utf-8")))
    email = data['email'].split('@')[0]
    alph = 'qa0zwsxercdfvt78gb4yhnujmik9olp3.6-1_52'
    id = ''
    status =''
    for i in range(len(email)):
        letter = email[i:i+1]
        for y in range(len(alph)):
            if letter == alph[y:y+1]:
                id = id + alph[y+1:y+2] + str(abs(y-7))
        
    encoded = ''
    try:
        dd = PikaDB_Script.get_doc('users',str(hashlib.md5(id.encode()).hexdigest()))
        if dd == 'none':
            status = {'id':str(hashlib.md5(id.encode())),'status':'redirecting...'}
            ver_num = str(random.randint(34051,78052))
            PikaDB_Script.add_doc('waiting',f'{str(hashlib.md5(id.encode()).hexdigest())}_{ver_num}',data)
            sendEmail(ver_num,data['email'],data["firstName"])
            encoded = jwt.encode(status, private_key, algorithm="RS256")
        else:
            status = {'id':'none','status':'email already exists'}
            encoded = jwt.encode(status, private_key, algorithm="RS256")
    except:
        status = {'id':id,'status':'redirecting...'}
        ver_num = str(random.randint(34051,78052))
        PikaDB_Script.add_doc('waiting',f'{str(hashlib.md5(id.encode()).hexdigest())}_{ver_num}',data)
        sendEmail(ver_num,data['email'],data["firstName"])
        encoded = jwt.encode(status, private_key, algorithm="RS256")
     # should display 'bar'
    return encoded


                                #  Login

@app.route('/markit_ears_api', methods=['POST'])
def login():
    data = json.loads(str(request.data.decode("utf-8")))
    email = data['email'].split('@')[0]
    alph = 'qa0zwsxercdfvt78gb4yhnujmik9olp3.6-1_52'
    id = ''
    encoded = 'wrong email or password'
    status = ''
    for i in range(len(email)):
        letter = email[i:i+1]
        for y in range(len(alph)):
            if letter == alph[y:y+1]:
                id = id + alph[y+1:y+2] + str(abs(y-7))
    try:
        db = PikaDB_Script.get_doc('users',str(hashlib.md5(id.encode()).hexdigest()))
        if db != 'none':
            pwd = data["password"]
            if db["password"] == pwd :
                status = {"id":str(hashlib.md5(id.encode()).hexdigest()),"number":db['number'],"jwt_sfwt_key":"cnowarie7uh934ppqal192uws81jfgw3wz095zaevdas4"}
                encoded = jwt.encode(status, private_key, algorithm="RS256")
            else:
                encoded = 'wrong email or password'
        else:
            encoded = 'wrong email or password'
    except:
        encoded = 'wrong email or password'

    return encoded


                                #  Verify
@app.route('/markit_verify_api', methods=['POST'])
def verify():
    data = json.loads(str(request.data.decode("utf-8")))
    email = data['email'].split('@')[0]
    alph = 'qa0zwsxercdfvt78gb4yhnujmik9olp3.6-1_52'
    id = ''
    status = ' '
    for i in range(len(email)):
        letter = email[i:i+1]
        for y in range(len(alph)):
            if letter == alph[y:y+1]:
                id = id + alph[y+1:y+2] + str(abs(y-7))
    try:
        x = str(hashlib.md5(id.encode()).hexdigest())+'_'+data['code']
        db = PikaDB_Script.get_doc('waiting',x)
        w = open('./markit_db/numbers.db','r')
        r = w.read()[:len(w.read())-1]
        e = json.loads('{"ok":['+r+']}')
        db_number_write = open('./markit_db/numbers.db', 'a')
        if db != 'none':
            PikaDB_Script.add_doc('users',str(hashlib.md5(id.encode()).hexdigest()),db)
            PikaDB_Script.delete_doc('waiting',x)
            lst = []
            num_lst = e["ok"]
            for i in range(10000):
                lst.append(str(i))
            for y in range(len(num_lst)):
                lst.remove(num_lst[y])
            num = lst[random.randint(0,len(lst))]
            PikaDB_Script.update_doc('users',str(hashlib.md5(id.encode()).hexdigest()),{"number":[num]})
            db_number_write.write(f'"{num}",')
            status = num
        else:
            status = 'wrong code.'
    except:
        status = 'wrong code.'

    return status


@app.route('/markit_number_api', methods=['POST'])
def get_number():
    data = str(request.data.decode("utf-8"))
    ok = json.loads(data)

    res = {}
    if data:
        res = jwt.decode(ok['num_id'],public_key,algorithms=["RS256"])
    
    db_number_write = open('./markit_db/numbers.db', 'a')
    email = res['email'].split('@')[0]
    alph = 'qa0zwsxercdfvt78gb4yhnujmik9olp3.6-1_52'
    id = ''
    status = ' '
    for i in range(len(email)):
        letter = email[i:i+1]
        for y in range(len(alph)):
            if letter == alph[y:y+1]:
                id = id + alph[y+1:y+2] + str(abs(y-7))
    try:
        
        x = str(hashlib.md5(id.encode()).hexdigest())+'_'+res['code']
        db = PikaDB_Script.get_doc('waiting',x)
        if db != 'none':
            PikaDB_Script.update_doc('users',str(hashlib.md5(id.encode()).hexdigest()),{"number":[str(res["number"])]})
            db_number_write.write(f'"{str(res["number"])}",')
            status = ' '
        else:
            status = 'wrong code.'
    except:
        status = 'wrong code.'

    return 'ok'

@app.route('/register_number',methods=['POST'])
def register_num():
    data = json.loads(str(request.data.decode("utf-8")))
    # print('okk:',data)
    a_data = jwt.decode(data['sale'],public_key,algorithms=["RS256"])
    try:
        user = PikaDB_Script.get_doc('users',a_data['id'])
        if  a_data['number'] in user['number']:
            try:
                db = PikaDB_Script.add_doc('market',a_data['number'],{"id":a_data['id'],"price":a_data['price']})
                if db != 'added':
                    PikaDB_Script.update_doc('market',a_data['number'],{"price":a_data['price']})                
            except:
                return ''
    except:
        status = ''
        
    return 'ok'

@app.route('/market_api',methods=['GET'])
def get_market():
    db = PikaDB_Script.dump_table('market')
    return db

@app.route('/numbers_api',methods=['POST'])
def get_numbers():
    data1 = json.loads(str(request.data.decode("utf-8")))
    data = jwt.decode(data1['data'],public_key,algorithms=["RS256"])
    res = ''
    try:
        db = PikaDB_Script.get_doc('users',data['id'])
        if db != 'none':
            db['password']='##################################'
            res = {'prf':db}
        else:
            res = 'no.'
    except:
        res = 'no.'
    return res

@app.route('/offer_api',methods=['POST'])
def get_offer():
    data = json.loads(str(request.data.decode("utf-8")))
    offer = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    back = 'fail'
    db = PikaDB_Script.add_doc('offers',str(offer["offer"]["number"]+'_'+offer["offer"]["id"]),{"price":offer["offer"]["price"],"nums_offerd":offer["offer"]["nums_offered"],"status":"pending"})
    if db != 'added':
        PikaDB_Script.update_doc('offers',str(offer["offer"]["number"]+'_'+offer["offer"]["id"]),{"price":offer["offer"]["price"],"nums_offerd":offer["offer"]["nums_offered"],"status":"pending"})
    back = 'success'
        # print(json.dumps(offer_c)[1:len(json.dumps(offer_c))-1]+",")
    return back

@app.route('/number_offers_api',methods=['POST'])
def get_numbers_api():
    data_bf = json.loads(str(request.data.decode("utf-8")))
    data = jwt.decode(data_bf["data"],public_key,algorithms=["RS256"])
    # db_user_read = open('./markit_db/user_db1.db', 'r')
    # db_offer_read = open('./markit_db/offer.db', 'r')
    # f = db_user_read.read()
    # z = json.loads('{'+str(f)[:len(str(f))-1]+'}')
    # q = db_offer_read.read()
    # w = json.loads('{'+str(q)[:len(str(q))-1]+'}')
    res = {}
    row = []
    string1 = string.digits
    try:
        db = PikaDB_Script.get_doc('users',data['id'])
        offer_db = PikaDB_Script.dump_table('offers')
        numbers = db['number']
        for y in range(len(numbers)):
            idd = list(offer_db.keys())
            for i in range(len(idd)):
                if idd[i][:len(numbers[y])-len(idd[i])] == numbers[y]:
                    row.append({numbers[y]:offer_db[idd[i]],"offer_id":get_random_string(7)+idd[i].split("_")[1]+get_random_string(9)})
        # res = 'try again.'
        res["offers"] = row
        return res
    except:
        res = 'nope.'
        return res

@app.route('/accept_offer',methods=['POST'])
def accept_offer():
    data = json.loads(str(request.data.decode("utf-8")))
    offer = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    try:
        offer_id = offer['number']+"_"+offer['id'][7:len(offer['id'])-9]
        PikaDB_Script.update_doc('offers',offer_id,{"status":"accepted"})
        return 'accepted'
    except:
        return 'no'

@app.route('/buying_done',methods=['POST'])
def purchase_complete():
    data = json.loads(str(request.data.decode("utf-8")))
    purchase_data = jwt.decode(data["data"],public_key,algorithms=["RS256"])["transaction"]
    try:
        db = PikaDB_Script.get_doc('market',purchase_data["number"])
        if db != 'none':
            if db["price"] == purchase_data["price"]:
                try:
                    user_db = PikaDB_Script.get_doc('users',purchase_data["offer_id"])
                    user1_db = PikaDB_Script.get_doc('users',purchase_data["id"])
                    if purchase_data["number"] in user_db["number"]:
                        try:
                            h = PikaDB_Script.dump_table('offers')
                            offers = list(h.keys())
                            for x in range(len(offers)):
                                if purchase_data["number"] == offers[x][:len(purchase_data["number"])-len(offers[x])]:
                                    PikaDB_Script.delete_doc('offers',offers[x])
                        except:
                            print('no2')
                        
                        new_numbers = user_db["number"]
                        new_numbers.remove(purchase_data["number"])
                        user_db["number"] = new_numbers
                        new_numbers2 = user1_db["number"]
                        try:
                            user_db["balance"]
                            money_had = float(user_db["balance"])
                            money_have = float(purchase_data["price"]) + money_had
                            user_db["balance"] = str(money_have)
                        except:
                            user_db["balance"] = purchase_data["price"]
                        new_numbers2.append(purchase_data["number"])
                        user1_db["number"] = new_numbers2
                        PikaDB_Script.update_doc('users',purchase_data["offer_id"],user_db)
                        PikaDB_Script.update_doc('users',purchase_data["id"],user1_db)
                        PikaDB_Script.delete_doc('market',purchase_data["number"])
                        return 'done'
                    else:
                        return 'declined'
                except:
                    return 'declined1'
                
            else:
                return 'declined2'
        # return z[offer['number']+"/"+offer['id']['offer_id']]
    except:
        return 'no'

@app.route('/number_offers_made_api',methods=['POST'])
def get_numbers_made_api():
    data = json.loads(str(request.data.decode("utf-8")))
    offer = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    w = PikaDB_Script.dump_table('offers')
    res = {}
    row = []
    try:
        try:
            offers = list(w.keys())
            for x in range(len(offers)):
                if offer["id"] == offers[x][len(offers[x])-len(offer['id']):]:
                    row.append({offers[x].split('_')[0]:w[offers[x]]})
            return {"offers":row}
        except:
            return 'no'
    except:
        return 'no.'

@app.route('/offer_buy_done',methods=['POST'])
def offer_purchase_complete():
    data = json.loads(str(request.data.decode("utf-8")))
    purchase_data = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    try:
        offer_db = purchase_data["number"]+'_'+purchase_data["id"]
        offer_id = PikaDB_Script.get_doc('offers',offer_db)
        if offer_id["price"] == purchase_data["price"] and offer_id["nums_offerd"] == purchase_data["nums_offerd"] and offer_id["status"] == "accepted":
            try:
                xyz = PikaDB_Script.get_doc('market',purchase_data["number"])
                current_owner = xyz['id']
                current_user_db = PikaDB_Script.get_doc('users',current_owner)
                new_owner = purchase_data["id"]
                new_user_db = PikaDB_Script.get_doc('users',new_owner)
                traded_nums = offer_id["nums_offerd"]
                CList = current_user_db['number']
                NList = new_user_db['number']
                print(CList,'///',NList)
                for i in range(len(traded_nums)):
                   CList.append(traded_nums[i])
                   NList.remove(traded_nums[i])

                NList.append(purchase_data["number"])
                CList.remove(purchase_data["number"])        

                if purchase_data["price"] != "":
                    try:
                        current_user_db["balance"]
                        money_had = float(current_user_db["balance"])
                        money_have = float(purchase_data["price"]) + money_had
                        current_user_db["balance"] = str(money_have)
                    except:
                        current_user_db["balance"] = purchase_data["price"]
                PikaDB_Script.update_doc('users',new_owner,{"number":NList})
                PikaDB_Script.update_doc('users',current_owner,{"number":CList,"balance":current_user_db["balance"]})
                PikaDB_Script.delete_doc('market',purchase_data["number"])
                PikaDB_Script.delete_doc('offers',offer_db)
                return 'ok'
            except:
                return 'declined1'
        else:
            return 'declined2'
    except:
        return 'no'

@app.route('/load_account',methods=['POST'])
def load_account():
    data = json.loads(str(request.data.decode("utf-8")))
    trans = jwt.decode(data["data"],public_key,algorithms=["RS256"])["transaction"]
    try:
        db = PikaDB_Script.get_doc('users',trans["id"])
        try:
            db["balance"]
            balance = float(db["balance"])
            amount = float(trans["price"])
            PikaDB_Script.update_doc('users',trans['id'],{"balance":str(balance+amount)})
        except:
            PikaDB_Script.update_doc('users',trans['id'],{"balance":trans["price"]})
        return 'balance updated'
    except:
        return 'no'


@app.route('/offer_buy_done_w_number',methods=['POST'])
def offer_purchase_w_number_complete():
    data = json.loads(str(request.data.decode("utf-8")))
    purchase_data = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    try:
        offer_db = purchase_data["number"]+'_'+purchase_data["id"]
        offer_id = PikaDB_Script.get_doc('offers',offer_db)
        if offer_id["price"] == purchase_data["price"] and offer_id["nums_offerd"] == purchase_data["nums_offerd"] and offer_id["status"] == "accepted":
            try:
                xyz = PikaDB_Script.get_doc('market',purchase_data["number"])
                current_owner = xyz['id']
                current_user_db = PikaDB_Script.get_doc('users',current_owner)
                new_owner = purchase_data["id"]
                print(current_owner,'///',new_owner)
                new_user_db = PikaDB_Script.get_doc('users',new_owner)
                traded_nums = offer_id["nums_offerd"]
                CList = current_user_db['number']
                NList = new_user_db['number']
                # print(CList,'///',NList)
                for i in range(len(traded_nums)):
                   CList.append(traded_nums[i])
                   NList.remove(traded_nums[i])
                print(NList,'///',CList,'///',purchase_data["number"])
                NList.append(purchase_data["number"])
                CList.remove(purchase_data["number"])        
                
                
                if purchase_data["price"] != "":
                    try:
                        current_user_db["balance"]
                        money_had = float(current_user_db["balance"])
                        money_have = float(purchase_data["price"]) + money_had
                        current_user_db["balance"] = str(money_have)
                    except:
                        current_user_db["balance"] = purchase_data["price"]
                    try:
                        new_user_db["balance"]
                        if float(new_user_db['balance']) >= float(purchase_data['price']):
                            money_had = float(new_user_db["balance"])
                            money_have = float(purchase_data["price"])*-1 + money_had
                            new_user_db["balance"] = str(money_have)
                        else:
                            return 'not enough to complete order'
                    except:
                        return 'not enough to complete order'
                PikaDB_Script.update_doc('users',new_owner,{"number":NList,"balance":new_user_db["balance"]})
                PikaDB_Script.update_doc('users',current_owner,{"number":CList,"balance":current_user_db["balance"]})
                PikaDB_Script.delete_doc('market',purchase_data["number"])
                PikaDB_Script.delete_doc('offers',offer_db)
                return 'ok'
            except:
                return 'declined1'
        else:
            return 'declined2'
    except:
        return 'no'

@app.route('/buying_w_number_done',methods=['POST'])
def purchase_w_number_complete():
    data = json.loads(str(request.data.decode("utf-8")))
    purchase_data = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    try:
        user0_db = PikaDB_Script.get_doc('users',purchase_data["id"])
        user0_db["balance"]
        if float(user0_db["balance"]) >= float(purchase_data["price"]):
            try:
                db = PikaDB_Script.get_doc('market',purchase_data["number"])
                if db != 'none':
                    if db["price"] == purchase_data["price"]:
                        try:
                            user_db = PikaDB_Script.get_doc('users',purchase_data["offer_id"])
                            user1_db = PikaDB_Script.get_doc('users',purchase_data["id"])
                            if purchase_data["number"] in user_db["number"]:
                                try:
                                    h = PikaDB_Script.dump_table('offers')
                                    offers = list(h.keys())
                                    for x in range(len(offers)):
                                        if purchase_data["number"] == offers[x][:len(purchase_data["number"])-len(offers[x])]:
                                            PikaDB_Script.delete_doc('offers',offers[x])
                                except:
                                    print('no2')
                                
                                new_numbers = user_db["number"]
                                new_numbers.remove(purchase_data["number"])
                                user_db["number"] = new_numbers
                                new_numbers2 = user1_db["number"]
                                try:
                                    user_db["balance"]
                                    money_had = float(user_db["balance"])
                                    money_have = float(purchase_data["price"]) + money_had
                                    user_db["balance"] = str(money_have)
                                except:
                                    user_db["balance"] = purchase_data["price"]

                                try:
                                    user1_db["balance"]
                                    money_had = float(user1_db["balance"])
                                    money_have = float(purchase_data["price"])*-1 + money_had
                                    user1_db["balance"] = str(money_have)
                                except:
                                    user_db["balance"] = purchase_data["price"]
                                
                                new_numbers2.append(purchase_data["number"])
                                user1_db["number"] = new_numbers2
                                PikaDB_Script.update_doc('users',purchase_data["offer_id"],user_db)
                                PikaDB_Script.update_doc('users',purchase_data["id"],user1_db)
                                PikaDB_Script.delete_doc('market',purchase_data["number"])
                                return 'done'
                            else:
                                return 'declined'
                        except:
                            return 'declined1'
                        
                    else:
                        return 'declined2'
                # return z[offer['number']+"/"+offer['id']['offer_id']]
            except:
                return 'no'
    except:
        return 'no'

@app.route('/deny_offer',methods=['POST'])
def deny_offer():
    data = json.loads(str(request.data.decode("utf-8")))
    offer = jwt.decode(data["data"],public_key,algorithms=["RS256"])
    try:
        offer_id = offer['number']+"_"+offer['id'][7:len(offer['id'])-9]
        PikaDB_Script.delete_doc('offers',offer_id)
        return 'deleted'
    except:
        return 'no'


@app.route('/numbers_taken',methods=["GET"])
def number_taken():
    w = open('./markit_db/numbers.db','r')
    r = w.read()[:len(w.read())-1]
    e = json.loads('{"numbers":['+r+']}')
    return e
app.run(host = '0.0.0.0', port=4242)
