
export default param => ({
    "name": "real-transform",
    "transform": function(code, id) {
        if (!this.getModuleInfo(id).isEntry || !param.is_real_bundle) return null;
         /* append a stop marker printing code */
        return code + "\nconsole.log('__eb3caide9Oojaiku__stop_marker__');";
    }
});