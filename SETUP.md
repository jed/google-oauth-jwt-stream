Setting up a Google API service account
=======================================

1. Go to the [Google API Console](https://console.developers.google.com/project).

2. Click on **Create Project**.

  ![screen shot 2015-03-07 at 11 14 42 pm](https://cloud.githubusercontent.com/assets/4433/6544554/5051dffa-c523-11e4-946e-c2d2fb67529f.png)

3. Specify a project name and id, and click **Create**.

  ![screen shot 2015-03-07 at 11 14 53 pm](https://cloud.githubusercontent.com/assets/4433/6544558/505a0e3c-c523-11e4-9c8f-bc723578eac2.png)

4. On the dashboard, click **Credentials** under **APIs & auth**

  ![screen shot 2015-03-07 at 11 15 22 pm](https://cloud.githubusercontent.com/assets/4433/6544555/5053c752-c523-11e4-8c68-d5e24e364167.png)


5. Click **Create new Client ID**.

  ![screen shot 2015-03-07 at 11 15 27 pm](https://cloud.githubusercontent.com/assets/4433/6544557/50565c6a-c523-11e4-8599-cff7f65bf1c3.png)


6. Select **Service Account**, and click **Create Client ID**.

  ![screen shot 2015-03-07 at 11 15 36 pm](https://cloud.githubusercontent.com/assets/4433/6544556/50556c06-c523-11e4-8587-47880e0e420d.png)


7. Remember the displayed private key password, and click **Okay, got it**. A `.p12` file will also be downloaded, so make sure you can locate it.

  ![screen shot 2015-03-07 at 11 15 47 pm](https://cloud.githubusercontent.com/assets/4433/6544553/5050ac8e-c523-11e4-9cc0-d2ae3a64ca4a.png)

8. Save the email address belonging to the the Client ID.

  ![screen shot 2015-03-07 at 11 15 51 pm](https://cloud.githubusercontent.com/assets/4433/6544552/504ff7bc-c523-11e4-89e0-985512c33eac.png)

9. Open up your favorite terminal app, and navigate to the directory in which the `.p12` file was downloaded. Then execute the following command, replacing `P12_FILE_NAME` with the name of your `.p12` file.

  `openssl pkcs12 -in P12_FILE_NAME.p12 -out key.pem -nodes`
  
  You'll need to enter the private key password as shown in step 7.

  ![screen shot 2015-03-07 at 11 20 04 pm](https://cloud.githubusercontent.com/assets/4433/6544560/505e05a0-c523-11e4-8a6b-e7c90aac1f17.png)
  
10. Verify that a `key.pem` file was created. This, along with the email address from step 8, is all you need to create access tokens for this account.
