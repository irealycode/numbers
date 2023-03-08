import smtplib, ssl
import os
from email.message import EmailMessage
import random
port = 465  # For starttls
smtp_server = "smtp.gmail.com"


def sendEmail(ver_num,receiver_email,receiver_name):
    sender_email = "markit.incorporation@gmail.com"
    # receiver_email = "irealycode@gmail.com"
    ok = open('MARKIT_PASSWD','r')
    password = ok.read()
    em = EmailMessage()
    em['From'] = sender_email
    em['To'] = receiver_email
    em['Subject'] = 'email verification'
    message = f"Hello {receiver_name},\nPlease verify your email by entering this number:{ver_num}"

    em.set_content(message)


    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, em.as_string())
