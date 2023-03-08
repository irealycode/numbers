import React, { useEffect } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

export default function TNS(){
    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) { 
        return null;
      }
    return(
        <View style={{alignItems:'center',backgroundColor:'black',height:'100%'}} >
            <ScrollView>
            <h2 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Terms and Conditions</strong></h2>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Welcome to numbers!</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >These terms and conditions outline the rules and regulations for the use of pika's Website, located at numbers.io.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >By accessing this website we assume you accept these terms and conditions. Do not continue to use numbers if you do not agree to take all of the terms and conditions stated on this page.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Cookies</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We employ the use of cookies. By accessing numbers, you agreed to use cookies in agreement with the pika's Privacy Policy. </p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>License</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Unless otherwise stated, pika and/or its licensors own the intellectual property rights for all material on numbers. All intellectual property rights are reserved. You may access this from numbers for your own personal use subjected to restrictions set in these terms and conditions.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >You must not:</p>
            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Republish material from numbers</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Sell, rent or sub-license material from numbers</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Reproduce, duplicate or copy material from numbers</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Redistribute content from numbers</li>
            </ul>


            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. pika does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of pika,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, pika shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >pika reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >You warrant and represent that:</p>

            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
            </ul>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >You hereby grant pika a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Hyperlinking to our Content</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >The following organizations may link to our Website without prior written approval:</p>

            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Government agencies;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Search engines;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >News organizations;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
            </ul>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We may consider and approve other link requests from the following types of organizations:</p>

            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >commonly-known consumer and/or business information sources;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >dot.com community sites;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >associations or other groups representing charities;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >online directory distributors;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >internet portals;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >accounting, law and consulting firms; and</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >educational institutions and trade associations.</li>
            </ul>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of pika; and (d) the link is in the context of general resource information.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to pika. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Approved organizations may hyperlink to our Website as follows:</p>

            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >By use of our corporate name; or</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >By use of the uniform resource locator being linked to; or</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
            </ul>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >No use of pika's logo or other artwork will be allowed for linking absent a trademark license agreement.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>iFrames</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Content Liability</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Your Privacy</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >Please read Privacy Policy</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Reservation of Rights</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Removal of links from our website</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

            <h3 style={{fontFamily:'JL',color:'white',textAlign:'center'}} ><strong>Disclaimer</strong></h3>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

            <ul>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >limit or exclude our or your liability for death or personal injury;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li style={{color:"white",fontFamily:'JL',textAlign:'center'}} >exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

            <p style={{fontFamily:'JL',color:'white',textAlign:'center'}} >As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
            </ScrollView>
        </View>
    )
}