sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.zshopfloor.shopfloor.controller.Dashboard", {

        // Helper function to get the router
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        onPlanMonth: function() {
            this.getRouter().navTo("plannedOrders");
        },

        onProdMonth: function() {
            this.getRouter().navTo("productionOrders");
        },

        onPlanYear: function() {
            this.getRouter().navTo("plannedYear");
        },

        onProdYear: function() {
            this.getRouter().navTo("productionYear");
        }
    });
});