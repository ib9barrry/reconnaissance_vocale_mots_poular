# reconnaissance_vocale_mots_poular
application mobile pour la reconnaissance vocale en poular des mots suivants: 
djarama=bonjour , tanaala = cava , djantoum = tout va bien, awa = d'accord . , 

Vous pouvez installer expo go sur votre telephone android ou ios apres avoir cloner le repo et installer les dependences pour utiliser l'application.

# lienApi est le lien de L'Api de reconnaissance vocale.
on enregistre le son, puis on l'envoie a L'Api => ensuite , L'Api transmet l'Audio a notre modele CNN 'le CNN fait une classification'
ensuite on recupere la classe predict , nous la faisons correspondre un dictionnaire, ou { 0,1,2,3 } sont les classes predicts et 'djarama , tanaala, djantoum, awa' leurs correspondences. en suite L'api return un json au format {'keyword' : mot_poular_predit }
