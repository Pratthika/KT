sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.Login", {

        onLogin: function() {
            var user = this.byId("userId").getValue();
            var pwd = this.byId("password").getValue();

            if (!user || !pwd) {
                MessageToast.show("Enter credentials");
                return;
            }

            var oModel = this.getView().getModel();
            
            // Added leading slash and ensured path is a valid string
            var sPath = "/ZET_SF_LOGIN_ODSet(Bname='" + user + "',Password='" + pwd + "')";

            var that = this;

            oModel.read(sPath, {
                success: function(oData) {
                    console.log("SUCCESS", oData);
                    
                    if (oData.Status === "S") {
                        MessageToast.show("Login successful");
                        
                        // --- NAVIGATION LOGIC ---
                        // 'dashboard' must match the route name in manifest.json
                        var oRouter = that.getOwnerComponent().getRouter();
                        oRouter.navTo("dashboard"); 
                    } else {
                        MessageToast.show("Invalid Login: " + (oData.Message || "Check credentials"));
                    }
                },
                error: function(oError) {
                    console.log("ERROR", oError);
                    MessageToast.show("Backend connection failed");
                }
            });
        }
    });
});