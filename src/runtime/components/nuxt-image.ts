import nuxtImageMixin from './nuxt-image-mixins'

import './nuxt-image.css'

const imageHTML = ({ generatedSrc, generatedSrcset, generatedSizes, width, height, alt }) => 
`<img class="__nim_org" src="${generatedSrc}" srcset="${generatedSrcset}" sizes="${generatedSizes}" width="${width}" height="${height}" alt="${alt}" >`

export default {
    name: "NuxtImage",
    mixins: [nuxtImageMixin],
    computed: {
        generatedSrcset() {
            return this.sizes.map(({ width, url }) => width ? `${url} ${width}w` : url).join(', ')
        },
        generatedSizes() {
            return this.sizes.map(({ width, media }) => width ? `${media} ${width}px` : media).reverse().join(', ')
        },
        generatedSrc() {
            if (this.sizes.length) {
                return this.sizes[0].url
            }
            return this.src
        }
    },
    render(h) {
        if (this.legacy) {
            return this.renderLegacy(h)
        }
        const bluryImage = h('img', {
            class: '__nim_full __nim_blur',
            attrs: {
                src: this.blurry,
                alt: this.alt
            }
        })

        const originalImage = h('img', {
            class: ['__nim_org'],
            attrs: {
                src: this.loading ? this.generatedSrc : undefined,
                srcset: this.loading ? this.generatedSrcset : undefined,
                sizes: this.loading ? this.generatedSizes : undefined,
                alt: this.alt,
                width: this.width,
                height: this.height,
            },
            on: {
                load: () => {
                    this.loaded = true
                }
            }
        })


        const noScript = h('noscript', {
            domProps: { innerHTML: imageHTML(this) }
        }, [])

        const placeholder = h('div', {
            class: '__nim_pl',
            style: {
                paddingBottom: this.height ? `${this.height}` : undefined,
            }
        })

        const wrapper = h('div', {
            style: {
                width: this.width ? this.width : undefined
            },
            class: ['__nim_w', this.loaded ? 'visible' : ''],
        }, [bluryImage, originalImage, noScript, placeholder])

        return wrapper;
    },
    methods: {
        renderLegacy(h) {
            return h('img', {
                class: '',
                attrs: {
                    src: this.generatedSrc,
                    srcset: this.generatedSrcset,
                    sizes: this.generatedSizes,
                    alt: this.alt
                }
            })
        }
    }
}