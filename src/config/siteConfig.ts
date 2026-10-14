import { BadgeInfo, FamilyTaskInfo, GradeInfo } from '../types/platform';

export const SITE_CONFIG = {
  siteName: 'Tarhan Koleji Kodluyor',
  heroHeading: 'Tarhan Koleji Kodluyor!',
  slogan: 'Kodla, keşfet, geleceği tasarla!',
  heroDescription:
    'Bir robotu yönlendir, kendi oyununu tasarla, hataları keşfet ve fikirlerini kodlarla hayata geçir.',
  eventDates: '10–25 Ekim 2026 Kodlama Haftası',
  institution: 'Tarhan Koleji Başakşehir Kampüsü',
  coordinatorName: 'Fatih Anıl Konca',
  coordinatorTitle: 'Bilişim Teknolojileri ve Yazılım Öğretmeni',
  // Gerçek okul logosu ekleneceği zaman dosya yolu buraya yazılabilir (boş bırakıldığında temiz tipografi gösterilir)
  logoUrl: '',
  coreApproach: 'Önce keşfet, sonra dene, hatanı düzelt ve üretimini paylaş.',
  codingDefinition:
    'Kodlama, bir işi yapmak için bilgisayara veya robota açık ve sıralı komutlar vermektir.',
  coreOutcomes: [
    {
      title: 'Problemi küçük parçalara ayırma',
      description: 'Karmaşık bir görevi anlaşılır ve yönetilebilir adımlara bölerek çözme.'
    },
    {
      title: 'Adım adım düşünme',
      description: 'Komutların doğru sırayla çalışması için mantıksal algoritma kurma.'
    },
    {
      title: 'Deneme ve düzeltme',
      description: 'Beklenmeyen sonuçları birer ipucu olarak görüp hatayı bularak iyileştirme.'
    },
    {
      title: 'Üretme',
      description: 'Yalnızca hazır içerik tüketmek yerine kendi oyununu, desenini ve aracını tasarlama.'
    },
    {
      title: 'İş birliği',
      description: 'Aile ve arkadaşlarla fikir paylaşarak ortak çözümler geliştirme.'
    }
  ],
  certificateTitle: 'Tarhan Koleji Kodluyor — Kodlama Haftası Katılım Belgesi',
  certificateDisclaimer:
    'Bu belge, Tarhan Koleji Başakşehir Kampüsü Kodlama Haftası etkinliklerine katılımı ve tamamlanan öğrenme görevlerini hatıra olarak belgelemek amacıyla düzenlenmiştir; resmî yeterlilik veya uluslararası sertifika niteliği taşımaz.',
  storageNotice:
    'İlerlemeniz yalnızca bu cihazda ve kullandığınız tarayıcıda (localStorage) saklanır; farklı cihazlar arasında otomatik taşınmaz. Kişisel veri (gerçek ad, e-posta, okul numarası) toplanmaz.'
};

export const GRADES: GradeInfo[] = [
  {
    id: 'anaokulu-3',
    label: 'Anaokulu 3 Yaş',
    shortLabel: '3 Yaş',
    ageRange: '3 Yaş',
    summary: 'Büyük yön okları, sesli yönergeler ve renk-şekil örüntüleriyle ilk sıralama adımları.',
    keyConcepts: ['Sıralama', 'Yön', 'Örüntü'],
    parentOutcome:
      'Çocuğunuz olayların belirli bir sırayla gerçekleştiğini ve basit görsel örüntülerin nasıl devam ettiğini keşfeder.',
    parentQuestion: 'Sence robot eve gitmek için önce hangi yöne adım atmalı?',
    isEarlyChildhood: true
  },
  {
    id: 'anaokulu-4-5',
    label: 'Anaokulu 4–5 Yaş',
    shortLabel: '4–5 Yaş',
    ageRange: '4–5 Yaş',
    summary: 'Sevimli hayvan dostlara yardım rotaları, komut kuyruğu takibi ve tekrarlı robot dansı.',
    keyConcepts: ['Algoritma', 'Hata Düzeltme', 'Tekrar'],
    parentOutcome:
      'Çocuğunuz birden fazla komutu sıraya dizmeyi, yanlış adımı fark edip düzeltmeyi ve tekrar kavramını deneyimleyerek öğrenir.',
    parentQuestion: 'Dans hareketlerini tek tek söylemek yerine "2 kez tekrar et" dediğimizde ne değişti?',
    isEarlyChildhood: true
  },
  {
    id: 'sinif-1-2',
    label: '1–2. Sınıf',
    shortLabel: '1–2. Sınıf',
    ageRange: '6–8 Yaş',
    summary: 'Robotun bakış yönüne göre dönüş komutları, engel aşma ve döngülerle geometrik desen üretimi.',
    keyConcepts: ['Algoritma', 'Bakış Yönü', 'Döngü', 'Hata Ayıklama'],
    parentOutcome:
      'Öğrencimiz robotun kendi bakış yönüne göre hareket etmesini planlar ve döngü kullanarak daha az blokla aynı deseni oluşturur.',
    parentQuestion: 'Aynı deseni 8 blok yerine döngü bloğuyla kurmak işimizi nasıl kolaylaştırdı?',
    isEarlyChildhood: true
  },
  {
    id: 'sinif-3-4',
    label: '3–4. Sınıf',
    shortLabel: '3–4. Sınıf',
    ageRange: '8–10 Yaş',
    summary: 'Blok tabanlı etkileşimli hikâye kurgulama ve hatalı kod dizilerini tahmin edip onarma.',
    keyConcepts: ['Olay', 'Sıralama', 'Tekrar', 'Test ve Hata Ayıklama'],
    parentOutcome:
      'Öğrencimiz olay-eylem sırasıyla kendi dijital hikâyesini kodlar ve hazır algoritmalardaki mantık hatalarını bularak düzeltir.',
    parentQuestion: 'Kodu çalıştırmadan önce tahminin neydi, çalıştırınca hangi adımı değiştirmen gerekti?'
  },
  {
    id: 'sinif-5-6',
    label: '5–6. Sınıf',
    shortLabel: '5–6. Sınıf',
    ageRange: '10–12 Yaş',
    summary: '2B blok dünyasında su kanalı mühendisliği ve kuralları değiştirilebilir oyun tasarım atölyesi.',
    keyConcepts: ['Koordinat', 'Döngü', 'Problemi Parçalara Ayırma', 'Olay', 'Koşul', 'Değişken'],
    parentOutcome:
      'Öğrencimiz büyük bir problemi alt adımlara böler ve hız, süre, puan değişkenleri ile çarpışma kurallarını yöneterek kendi oyununu tasarlar.',
    parentQuestion: 'Oyununda hedef puanı ve karakter hızını değiştirdiğinde oyunun zorluk dengesi nasıl etkilendi?'
  },
  {
    id: 'sinif-7-8',
    label: '7–8. Sınıf',
    shortLabel: '7–8. Sınıf',
    ageRange: '12–14 Yaş',
    summary: 'Sensör verileriyle akıllı okul otomasyonu (VE/VEYA mantığı) ve açıklanabilir yapay zekâ sınıflandırma simülasyonu.',
    keyConcepts: ['Koşul', 'Mantıksal Operatörler', 'Girdi–Çıktı', 'Veri ve Etiketleme', 'Test'],
    parentOutcome:
      'Öğrencimiz sensör girdilerini mantıksal operatörlerle işler ve veri etiketlemenin sınıflandırma doğruluğuna etkisini gözlemler.',
    parentQuestion: 'Eğitim verisinde yalnızca tek renk örnekler olduğunda sistem yeni nesneleri neden yanlış sınıflandırdı?'
  },
  {
    id: 'lise',
    label: 'Lise',
    shortLabel: 'Lise',
    ageRange: '14–18 Yaş',
    summary: 'Adım adım değişken izlemeli algoritma laboratuvarı ve okul ihtiyaçları için çalışan dijital çözüm geliştirme.',
    keyConcepts: ['Değişken', 'Koşul', 'Sınırlı Döngü', 'Algoritmik Test', 'Ürün Geliştirme'],
    parentOutcome:
      'Öğrencimiz değişkenlerin her adımdaki durumunu izleyerek algoritma kurar ve gerçek bir kullanıcı ihtiyacına yönelik çalışan bir web aracı üretir.',
    parentQuestion: 'Geliştirdiğin dijital çözüm okulda hangi somut sorunu çözüyor ve kullanıcı testinde neyi iyileştirdin?'
  }
];

export const BADGES: BadgeInfo[] = [
  {
    id: 'ilk-algoritmam',
    title: 'İlk Algoritmam',
    description: 'Adım adım komut dizisi kurarak robotu hedefe başarıyla ulaştırdın.',
    criteriaText: 'Adım adım yönlendirme etkinliklerinden (Etkinlik 1, 2 veya 3) en az birini tamamla.',
    requiredActivityIds: ['etkinlik-1', 'etkinlik-2', 'etkinlik-3']
  },
  {
    id: 'dongu-kasifi',
    title: 'Döngü Kâşifi',
    description: 'Tekrar eden adımları döngü bloklarıyla birleştirerek verimli kod yazdın.',
    criteriaText: 'Tekrar ve döngü içeren etkinliklerden (Etkinlik 4, 6 veya 9) en az birini tamamla.',
    requiredActivityIds: ['etkinlik-4', 'etkinlik-6', 'etkinlik-9']
  },
  {
    id: 'kosul-ustasi',
    title: 'Koşul Ustası',
    description: 'Sensör verileri, mantıksal kurallar ve koşullu ifadelerle doğru kararlar ürettin.',
    criteriaText: 'Koşul ve veri analizi etkinliklerinden (Etkinlik 11, 12 veya 13) en az birini tamamla.',
    requiredActivityIds: ['etkinlik-11', 'etkinlik-12', 'etkinlik-13']
  },
  {
    id: 'hata-avcisi',
    title: 'Hata Avcısı',
    description: 'Beklenmeyen sonuçları inceleyip hatalı komutları bularak algoritmayı onardın.',
    criteriaText: 'Hata ayıklama odaklı etkinliklerden (Etkinlik 5, 8 veya Birlikte Hata Avı) en az birini tamamla.',
    requiredActivityIds: ['etkinlik-5', 'etkinlik-8', 'aile-2']
  },
  {
    id: 'oyun-tasarimcisi',
    title: 'Oyun Tasarımcısı',
    description: 'Kendi dijital hikâyeni, oyununu veya okul çözümünü tasarlayıp çalıştırdın.',
    criteriaText: 'Üretim odaklı atölyelerden (Etkinlik 7, 10 veya 14) en az birini tamamla.',
    requiredActivityIds: ['etkinlik-7', 'etkinlik-10', 'etkinlik-14']
  },
  {
    id: 'ailece-kodladik',
    title: 'Ailece Kodladık',
    description: 'Aile bireyleriyle birlikte düşünüp ortak bir kodlama görevini tamamladınız.',
    criteriaText: 'Ailece Kodlama bölümündeki üç ortak görevden en az birini tamamla.',
    requiredActivityIds: ['aile-1', 'aile-2', 'aile-3']
  }
];

export const FAMILY_TASKS: FamilyTaskInfo[] = [
  {
    id: 'aile-1',
    title: 'Çocuğum Beni Kodluyor',
    subtitle: 'Ekran dışına taşan eğlenceli fiziksel algoritma oyunu',
    instruction:
      'Çocuk ekranda hareket komutlarını sıraya dizer. Veli güvenli ve boş bir alanda (veya oturarak yapılabilen alternatif modda) komutları sırasıyla uygular.',
    reflectionQuestion: 'Birlikte ne keşfettik? Hangi komutu uygularken daha dikkatli olmamız gerekti?',
    duration: '10 dk',
    concepts: ['Sıralama', 'Net Komut Verme', 'İş Birliği']
  },
  {
    id: 'aile-2',
    title: 'Birlikte Hata Avı',
    subtitle: 'Hatalı robot rotasını ailece konuşarak onarma görevi',
    instruction:
      'Haritadaki robot kütüphaneye gitmek istiyor ama komut dizisinde hatalar var. Önce mevcut kodu çalıştırıp hatayı gözlemleyin, ardından "Sence hangi adımı değiştirmeliyiz?" sorusuyla rotayı birlikte düzeltin.',
    reflectionQuestion: 'Birlikte ne keşfettik? Yanlış sonuç bize doğru yolu bulmak için nasıl ipucu verdi?',
    duration: '10 dk',
    concepts: ['Hata Ayıklama', 'Adım Adım İnceleme', 'Birlikte Problem Çözme']
  },
  {
    id: 'aile-3',
    title: 'Aile Desenimiz',
    subtitle: 'Şekil ve tekrar bloklarıyla ortak dijital aile mozaiği',
    instruction:
      'Renk, geometrik şekil ve tekrar sayısı bloklarını birlikte seçerek ailenize özel bir dijital desen oluşturun. Tamamladığınız deseni PNG görseli olarak cihazınıza indirebilirsiniz.',
    reflectionQuestion: 'Birlikte ne keşfettik? Tekrar bloğu desenimizi oluştururken bize nasıl yardımcı oldu?',
    duration: '12 dk',
    concepts: ['Döngü', 'Örüntü Tasarımı', 'Ortak Üretim']
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Platformu kullanmak için üyelik veya şifre gerekiyor mu?',
    answer:
      'Hayır. Tarhan Koleji Kodluyor tamamen tarayıcı üzerinden, hesap açmadan ve kişisel bilgi girmeden doğrudan kullanılabilir.'
  },
  {
    question: 'İlerlemem ve rozetlerim nerede saklanıyor?',
    answer:
      'Tamamladığınız etkinlikler, kazandığınız rozetler ve projeleriniz yalnızca kullandığınız cihazın tarayıcı hafızasında (localStorage) tutulur. Başka bir bilgisayara veya tablete geçtiğinizde otomatik taşınmaz.'
  },
  {
    question: 'Okuldaki ortak bilgisayarda benden sonra başka bir öğrenci kullanacaksa ne yapmalıyım?',
    answer:
      'Üst çubuktaki veya Kodlama Pasaportum sayfasındaki "Yeni Öğrenci / İlerlemeyi Sıfırla" düğmesine tıklayarak mevcut ilerlemeyi temizleyebilir ve yeni öğrenci için sıfırdan başlatabilirsiniz.'
  },
  {
    question: '10–25 Ekim 2026 Kodlama Haftası tarihleri geçtikten sonra etkinlikler kapanacak mı?',
    answer:
      'Hayır. Platformda tarihe bağlı herhangi bir erişim kilidi yoktur. Tüm etkinlikler yıl boyunca öğrenme ve tekrar amacıyla açık kalır.'
  },
  {
    question: 'Kodlama bilmeyen veliler çocuklarına nasıl destek olabilir?',
    answer:
      'Veli Alanı sayfasında her yaş grubu için sade açıklamalar ve yönlendirici sorular yer alır. Cevabı doğrudan söylemek yerine "Sence hangi adımı değiştirmeliyiz?" diye sormak en güçlü destektir.'
  }
];

export const UNPLUGGED_IDEAS = [
  {
    title: 'Kahvaltı Masası Algoritması',
    age: 'Anaokulu ve İlkokul',
    description:
      'Sofrayı hazırlarken veya sandviç yaparken adımları sırasıyla yüksek sesle söyleyin. Sıra karışırsa (örneğin ekmeği kesmeden önce peyniri koymak) ne olacağını birlikte konuşun.'
  },
  {
    title: 'Hava Durumu Koşulları (Eğer / Değilse)',
    age: 'İlkokul ve Ortaokul',
    description:
      'Evden çıkarken "EĞER yağmur yağıyorsa şemsiyeyi al, DEĞİLSE şapkayı al" gibi günlük kararları koşullu kod cümlelerine dönüştürün.'
  },
  {
    title: 'Çorap Eşleştirme Döngüsü ve Sıralama',
    age: 'Tüm Yaşlar',
    description:
      'Çamaşır sepetindeki çorapları en hızlı nasıl eşleştirebileceğinizi tartışın: Tek tek aramak mı yoksa önce renklere göre gruplamak mı daha az adım sürer?'
  },
  {
    title: 'Gözü Kapalı Rota Rehberi',
    age: 'Ailece Etkinlik',
    description:
      'Salonun ortasına yastıklardan güvenli küçük engeller koyun. Bir kişi yalnızca "2 adım ileri, sağa dön" gibi net komutlar vererek diğerini hedefe ulaştırsın.'
  }
];
