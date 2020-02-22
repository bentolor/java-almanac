Vue.component('sandbox', {
    template: `
        <tabs>
            <slot></slot>
            <tab v-bind:onTabClicked="compileandrun" name="▶︎ Run">
                <pre style="color: #eee; background-color: #333; margin: 0px; padding: 4px; overflow-y: scroll; height:150px;">{{ output }}</pre>
            </tab>
        </tabs>
    `,
    props: {
        version: { required: true },
        mainclass: { required: true }
    },
    data() {
        return {
            output: 'Output comes here...'
        };
    },
    methods: {
        compileandrun() {
            this.output = "Compile and run with " + this.version + " ...";
            sourcefiles= [];
            this.$children[0].$children.forEach(tab => {
                if (tab.source) {
                    sourcefiles.push({name: tab.name, content: tab.source});
                }
            });
            request = {
                mainclass: this.mainclass,
                sourcefiles: sourcefiles
            };
            url = "https://"  + this.version + ".sandbox.javaalmanac.io/compileandrun";
            axios.post(url , request).then(response => { 
                this.output = response.data.output;
            })
        }
    }
});

Vue.component('sandbox-source', {
    template: `
        <div class="tabs-frame" v-show="active" style="height: 120px;">
        </div>
    `,
    props: {
        name: { required: true },
    },
    data() {
        return {
            active: false,
            editor: Object,
            source: this.getSourceFromSlot()
        };
    },
    mounted() {
        this.editor = window.ace.edit(this.$el, {
            mode: "ace/mode/java",
            theme: 'ace/theme/almanac',
            highlightActiveLine: false,
            showGutter: false,
            showPrintMargin: false,
            maxLines: Infinity
        });
        this.editor.setValue(this.source, 1);
        this.editor.on('change', () => {
            this.source = this.editor.getValue()
        });
    },
    methods: {
        getSourceFromSlot() {
            if (this.$slots.default && this.$slots.default.length) {
                return this.$slots.default[0].text;
            }
            return ''
        }
    },
});