import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CreditCard,
  Gift,
  Heart,
  Leaf,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star
} from 'lucide-react';

const products = [
  {
    name: 'Calm',
    mood: 'Calm',
    scent: 'Blend aromatik untuk relaksasi',
    note: 'Pilihan tepat untuk membantu suasana hati menjadi tenang dan nyaman.',
    price: 'Rp45.000',
    priceValue: 45000,
    photo: '/images/products/calm-product.png',
    icon: Leaf,
    detail: {
      headline: 'CALM - Slow Down Your Mind.',
      emotionalDescription:
        'Untuk malam yang sunyi, pikiran yang lelah, dan hati yang butuh istirahat.',
      aromaProfile: {
        top: 'Lavender lembut',
        middle: 'Chamomile hangat',
        base: 'Soft musk'
      },
      experience:
        'Sumbu kayu menghasilkan suara api kecil seperti kayu terbakar pelan, membantu tubuh lebih rileks secara alami.',
      suitableFor: ['Sebelum tidur', 'Saat overthinking', 'Self-care time'],
      value: ['Handmade', 'Natural wax', 'Eco reusable jar', 'Burn time ±30 jam']
    }
  },
  {
    name: 'Focus',
    mood: 'Focus',
    scent: 'Blend aromatik untuk konsentrasi',
    note: 'Dirancang untuk menemani waktu belajar atau kerja agar tetap fokus.',
    price: 'Rp45.000',
    priceValue: 45000,
    photo: '/images/products/focus-product.png',
    icon: Brain,
    detail: {
      headline: 'FOCUS - Clear Mind. Sharp Direction.',
      emotionalDescription: 'Untuk hari produktif tanpa distraksi.',
      aromaProfile: {
        top: 'Lemon fresh',
        middle: 'Rosemary',
        base: 'Cedarwood ringan'
      },
      experience:
        'Aroma segar membantu meningkatkan konsentrasi, sementara suara api kayu menciptakan suasana tenang tanpa gangguan.',
      suitableFor: ['Belajar', 'Nugas', 'Kerja deep focus'],
      value: [
        'Boost productivity ritual',
        'Handmade premium blend',
        'Eco reusable jar',
        'Burn time ±30 jam'
      ]
    }
  },
  {
    name: 'Passion',
    mood: 'Passion',
    scent: 'Blend aromatik untuk suasana hangat',
    note: 'Menciptakan ambience yang romantis dan berkesan.',
    price: 'Rp45.000',
    priceValue: 45000,
    photo: '/images/products/passion-product.png',
    icon: Heart,
    detail: {
      headline: 'PASSION - Ignite The Moment.',
      emotionalDescription:
        'Untuk momen hangat yang ingin kamu buat lebih berkesan.',
      aromaProfile: {
        top: 'Sweet berry',
        middle: 'Rose',
        base: 'Vanilla warm'
      },
      experience:
        'Api kayu yang berderak halus menciptakan suasana intim dan hangat.',
      suitableFor: ['Date night', 'Anniversary', 'Me-time penuh percaya diri'],
      value: [
        'Romantic ambiance',
        'Sensory crackling wood wick',
        'Eco reusable jar',
        'Burn time ±30 jam'
      ]
    }
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

function App() {
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [selectedProductName, setSelectedProductName] = useState('Calm');
  const [bag, setBag] = useState({});
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const shouldReduceMotion = useReducedMotion();

  const featured = useMemo(
    () => products.find((product) => product.mood === selectedMood) || products[0],
    [selectedMood]
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product.name === selectedProductName) || products[0],
    [selectedProductName]
  );

  const bagItems = useMemo(
    () =>
      products
        .filter((product) => bag[product.name])
        .map((product) => ({ ...product, qty: bag[product.name] })),
    [bag]
  );

  const totalItems = useMemo(
    () => bagItems.reduce((total, item) => total + item.qty, 0),
    [bagItems]
  );

  const totalPrice = useMemo(
    () => bagItems.reduce((total, item) => total + item.priceValue * item.qty, 0),
    [bagItems]
  );

  const checkoutMessage = useMemo(() => {
    const itemLines =
      bagItems.length > 0
        ? bagItems.map((item) => `- ${item.name} x${item.qty}`).join('\n')
        : '- Belum ada produk dipilih';

    return `Halo Moodora, saya ingin memesan:\n${itemLines}\nTotal item: ${totalItems}\nTotal: Rp${totalPrice.toLocaleString('id-ID')}`;
  }, [bagItems, totalItems, totalPrice]);

  const whatsappCheckoutLink = `https://wa.me/6282297970015?text=${encodeURIComponent(checkoutMessage)}`;
  const canCheckout = bagItems.length > 0;

  function addToBag(productName) {
    setBag((prevBag) => ({
      ...prevBag,
      [productName]: (prevBag[productName] || 0) + 1
    }));
    setToastMessage(`${productName} ditambahkan ke tas.`);
  }

  function updateQty(productName, nextQty) {
    setBag((prevBag) => {
      if (nextQty <= 0) {
        const nextBag = { ...prevBag };
        delete nextBag[productName];
        return nextBag;
      }

      return {
        ...prevBag,
        [productName]: nextQty
      };
    });
  }

  function openProductDetail(productName) {
    setSelectedProductName(productName);
    setCurrentPage('detail');
  }

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 1900);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!showCartPanel) {
      setShowPaymentInfo(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showCartPanel]);

  function renderCatalogCards() {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {products.map((product, index) => {
          const Icon = product.icon;
          const active = selectedMood === product.mood;

          return (
            <motion.article
              key={product.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              onClick={() => setSelectedMood(product.mood)}
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
              className={`group cursor-pointer rounded-3xl p-5 text-left transition ${
                active
                  ? 'bg-[#fff8f1] shadow-aura'
                  : 'bg-[#fffaf5] hover:bg-[#fff4eb] hover:shadow-aura'
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold uppercase tracking-[0.12em] ${
                    active ? 'bg-[#ead0bc] text-[#694b3b]' : 'bg-[#f5e7db] text-[#5a4032]'
                  }`}
                >
                  {product.mood}
                </span>
                <Icon size={18} className={active ? 'text-[#694b3b]' : 'text-[#5a4032]'} />
              </div>

              <div className="mb-4 overflow-hidden rounded-2xl">
                <motion.img
                  src={product.photo}
                  alt={`Foto produk ${product.name}`}
                  className="h-40 w-full object-cover"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              <h3 className="font-display text-2xl text-[#4d372b]">{product.name}</h3>
              <p className="mt-1 text-base text-[#5b4336]">{product.scent}</p>
              <p className="mt-4 text-base leading-relaxed text-[#5b4336]">{product.note}</p>

              <div className="mt-5 flex items-center justify-between text-base font-semibold text-[#4d372b]">
                <span>{product.price}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openProductDetail(product.name);
                  }}
                  className="inline-flex items-center gap-1 text-[#6b4a38] transition hover:text-[#4d372b]"
                >
                  Detail <ArrowRight size={15} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    addToBag(product.name);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f382d] px-3 py-2.5 text-sm font-semibold text-[#fff7f0] transition hover:bg-[#3d2a21] sm:w-auto"
                >
                  <ShoppingBag size={14} /> Masukkan ke Tas
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowCartPanel(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fff8f1] px-3 py-2.5 text-sm font-semibold text-[#5a4032] transition hover:bg-[#f9eadc] sm:w-auto"
                >
                  <CreditCard size={14} /> Buka Keranjang
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    );
  }

  function renderDetailPage() {
    return (
      <section className="mt-6 min-h-[78vh] rounded-3xl bg-[#fffdf9] p-5 sm:p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage('catalog')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#fff3e8] px-3 py-2 text-sm font-semibold text-[#4d372b] transition hover:bg-[#f7e5d6]"
          >
            <ArrowLeft size={15} /> Kembali ke Katalog
          </button>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
            Detail Produk
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_380px]">
          <article className="rounded-3xl bg-[#fff8f1] p-5 sm:p-7">
            <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
              <img
                src={selectedProduct.photo}
                alt={`Foto produk ${selectedProduct.name}`}
                className="h-72 w-full rounded-2xl object-cover"
              />

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                  {selectedProduct.mood}
                </p>
                <h2 className="mt-2 font-display text-4xl text-[#4d372b]">{selectedProduct.name}</h2>
                <p className="mt-2 text-lg font-semibold text-[#6b4a38]">{selectedProduct.price}</p>
                <p className="mt-4 text-base leading-relaxed text-[#5b4336]">
                  {selectedProduct.detail.headline}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-6 text-[#5b4336]">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                  Deskripsi Emosional
                </h3>
                <p className="mt-2 text-base leading-relaxed">
                  {selectedProduct.detail.emotionalDescription}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                  Aroma Profile
                </h3>
                <ul className="mt-2 space-y-1 text-base">
                  <li>Top: {selectedProduct.detail.aromaProfile.top}</li>
                  <li>Middle: {selectedProduct.detail.aromaProfile.middle}</li>
                  <li>Base: {selectedProduct.detail.aromaProfile.base}</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                  Experience
                </h3>
                <p className="mt-2 text-base leading-relaxed">{selectedProduct.detail.experience}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                  Cocok Untuk
                </h3>
                <ul className="mt-2 space-y-1 text-base">
                  {selectedProduct.detail.suitableFor.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">Value</h3>
                <ul className="mt-2 space-y-1 text-base">
                  {selectedProduct.detail.value.map((item) => (
                    <li key={item}>✔ {item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <aside className="h-fit rounded-3xl bg-[#4f382d] p-5 text-[#fff4ea] lg:sticky lg:top-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5d7c6]">Aksi Cepat</p>
            <h3 className="mt-2 font-display text-2xl">Pilih Tindakan</h3>

            <div className="mt-5 rounded-2xl bg-[#62483b] p-3">
              <button
                type="button"
                onClick={() => addToBag(selectedProduct.name)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#fff4ea] px-4 py-3 text-base font-bold text-[#4d372b] transition hover:bg-[#fbe5d7]"
              >
                <ShoppingBag size={16} /> Masukkan ke Tas
              </button>

              <button
                type="button"
                onClick={() => setShowCartPanel(true)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e3bfa9] bg-transparent px-4 py-3 text-base font-bold text-[#fff4ea] transition hover:bg-[#75564a]"
              >
                <CreditCard size={16} /> Buka Keranjang
              </button>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <div className="relative overflow-hidden bg-grain">
      <main className="relative mx-auto w-[min(1180px,94%)] pb-20 pt-6 md:pt-10">
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="rounded-[30px] bg-[#fff9f2]/95 p-4 text-[#4d372b] shadow-aura backdrop-blur sm:p-6 md:p-8"
        >
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#fffdf9] px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="inline-flex items-center gap-3 rounded-lg px-1 py-1"
            >
              <motion.img
                src="/images/logo-moodora.png"
                alt="Moodora Logo"
                className="h-12 w-auto object-contain md:h-14"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <p className="font-display text-2xl leading-none text-[#4d372b] sm:text-3xl">Moodora</p>
            </button>

            <motion.button
              type="button"
              onClick={() => setShowCartPanel(true)}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="relative inline-flex items-center justify-center rounded-full bg-[#fff3e8] p-3 text-[#4d372b] transition hover:bg-[#fbeee3]"
            >
              <ShoppingBag size={19} />
              <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#c77c58] px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            </motion.button>
          </div>

          <div className="mt-4 inline-flex flex-wrap gap-2 rounded-2xl bg-[#fff4ea] p-2">
            {[
              { id: 'home', label: 'Beranda' },
              { id: 'catalog', label: 'Katalog' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentPage(tab.id)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  currentPage === tab.id
                    ? 'bg-[#4f382d] text-[#fff4ea]'
                    : 'bg-[#fffdf9] text-[#5a4032] hover:bg-[#f9eadc]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {currentPage === 'home' && (
            <>
              <div className="mt-6 rounded-3xl bg-[#fffdf9] p-6 sm:p-8">
                <h1 className="font-display text-3xl leading-tight text-[#4d372b] sm:text-4xl md:text-6xl">
                  Aromaterapi Premium
                  <span className="block text-[#7a5744]">Yang Mengikuti Mood Kamu</span>
                </h1>

                <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
                  <p className="max-w-xl text-lg leading-relaxed text-[#5b4336] md:text-xl">
                    Light your mood with premium aromatherapy crafted for focus, calm, and
                    presence.
                  </p>

                  <div className="rounded-2xl bg-[#fff9f2] p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                      Current Featured Mood
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-[#4d372b]">{featured.mood}</h3>
                    <p className="mt-1 text-base text-[#5b4336]">
                      {featured.name} - {featured.scent}
                    </p>
                    <motion.img
                      key={featured.name}
                      src={featured.photo}
                      alt={`Foto produk unggulan ${featured.name}`}
                      className="mt-4 h-36 w-full rounded-xl object-cover"
                      initial={shouldReduceMotion ? false : { opacity: 0.75, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f6e8de] px-3 py-1.5 text-sm font-bold text-[#6b4a38]">
                      <Star size={14} /> {featured.price}
                    </p>
                  </div>
                </div>
              </div>

              <section className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: 'Natural Wax Blend', desc: 'Soy wax premium, clean burn, low soot.' },
                  { icon: Gift, title: 'Gift-Ready Packaging', desc: 'Finishing elegan untuk hadiah dan hampers.' },
                  { icon: Sparkles, title: 'Mood-Driven Formula', desc: 'Blend aroma disusun berdasarkan emosi.' }
                ].map((feature, index) => (
                  <motion.article
                    key={feature.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.1, duration: 0.45 }}
                    className="rounded-2xl bg-[#fffaf4] p-5"
                  >
                    <feature.icon className="mb-3 text-[#6b4a38]" size={20} />
                    <h3 className="text-lg font-semibold text-[#4d372b]">{feature.title}</h3>
                    <p className="mt-1 text-base text-[#5b4336]">{feature.desc}</p>
                  </motion.article>
                ))}
              </section>
            </>
          )}

          {currentPage === 'catalog' && (
            <section className="mt-6 rounded-3xl bg-[#fffdf9] p-5 sm:p-6">
              <div className="mb-6 flex items-end justify-between gap-4 pb-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                    Mood Collection
                  </p>
                  <h2 className="font-display text-3xl text-[#4d372b] sm:text-4xl">
                    Katalog Aroma Berdasarkan Perasaan
                  </h2>
                </div>
              </div>
              {renderCatalogCards()}
            </section>
          )}

          {currentPage === 'detail' && renderDetailPage()}
        </motion.section>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed right-4 top-4 z-40 max-w-[90vw] rounded-xl bg-[#fff8f1] px-4 py-2 text-base font-semibold text-[#4d372b] shadow-md"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCartPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/55 p-3 sm:p-4 md:p-8"
              onClick={() => setShowCartPanel(false)}
            >
              <motion.section
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
                className="mx-auto flex h-full w-full max-w-3xl flex-col rounded-3xl bg-[#fff9f2] p-4 sm:p-5 md:p-7"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a4032]">
                      Keranjang
                    </p>
                    <h2 className="mt-1 font-display text-2xl text-[#4d372b] sm:text-3xl">
                      Isi Tas Belanja
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCartPanel(false)}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#4d372b]"
                  >
                    Tutup
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto rounded-2xl bg-[#fffdf9] p-4">
                  {bagItems.length === 0 && (
                    <p className="text-base text-[#5b4336]">
                      Keranjang masih kosong. Tambahkan produk dari halaman katalog.
                    </p>
                  )}

                  {bagItems.length > 0 && (
                    <div className="space-y-3">
                      {bagItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.photo}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-base font-semibold text-[#4d372b]">{item.name}</p>
                              <p className="text-sm text-[#5b4336]">{item.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.name, item.qty - 1)}
                              className="rounded-md bg-[#fff7ef] p-1.5 text-[#4d372b] transition hover:bg-[#f9ebde]"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-8 text-center text-base font-semibold text-[#4d372b]">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.name, item.qty + 1)}
                              className="rounded-md bg-[#fff7ef] p-1.5 text-[#4d372b] transition hover:bg-[#f9ebde]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl bg-[#fff3e8] p-4">
                  <div className="flex items-center justify-between text-base text-[#5b4336]">
                    <span>Total Item</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-lg font-bold text-[#4d372b]">
                    <span>Total Belanja</span>
                    <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!canCheckout}
                    onClick={() => setShowPaymentInfo((prev) => !prev)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c77c58] px-4 py-3 text-base font-bold text-white transition hover:bg-[#b26b49] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <CreditCard size={16} /> Bayar Online
                  </button>

                  <a
                    href={canCheckout ? whatsappCheckoutLink : '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (!canCheckout) event.preventDefault();
                    }}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold transition sm:w-auto ${
                      canCheckout
                        ? 'text-[#4d372b] hover:bg-[#f2dfd1]'
                        : 'cursor-not-allowed text-[#9f8f83]'
                    }`}
                  >
                    <MessageCircle size={16} /> Beli via WhatsApp
                  </a>
                </div>

                {showPaymentInfo && canCheckout && (
                  <p className="mt-3 text-sm text-[#5b4336]">
                    Pembayaran online: QRIS atau transfer bank. Kirim bukti pembayaran via
                    WhatsApp untuk konfirmasi.
                  </p>
                )}
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
