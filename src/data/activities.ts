import { ActivityDefinition } from '../types/platform';

export const ACTIVITIES: ActivityDefinition[] = [
  // ANAOKULU 3 YAŞ
  {
    id: 'etkinlik-1',
    title: 'Minik Robot Eve Gidiyor',
    grade: 'anaokulu-3',
    gradeLabel: 'Anaokulu 3 Yaş',
    description:
      'Büyük yön oklarını sıraya dizerek sevimli robotu kırmızı çatılı evine ulaştır.',
    duration: '8–10 dk',
    concepts: ['Sıralama', 'Yön'],
    level: 'Başlangıç',
    conceptSummary:
      'Sıralama, robotun hedefe ulaşması için adımları doğru sırayla arka arkaya dizmektir.',
    preschoolNote: 'Bir yetişkinle birlikte keşfedebilirsin.',
    tasks: [
      {
        id: 'e1-g1',
        title: '1. Görev: Tek Adımda Eve Var',
        instruction: 'Robot evin hemen solunda duruyor. Sağ oka (➡️) basıp Başlat düğmesine dokun!',
        exampleText: 'Örnek: ➡️ ekle ve Başlat düğmesine bas.'
      },
      {
        id: 'e1-g2',
        title: '2. Görev: İki Adım İlerle',
        instruction: 'Ev biraz daha uzakta! İki tane Sağ ok (➡️ ➡️) ekleyerek robotu evine götür.',
        exampleText: 'Örnek: ➡️ sonra ➡️ ekle.'
      },
      {
        id: 'e1-g3',
        title: '3. Görev: Köşeyi Dönerek Eve Git',
        instruction: 'Önce sağa, sonra aşağıya! Sağ ok (➡️) ve Aşağı ok (⬇️) kullanarak eve ulaş.',
        exampleText: 'Örnek: Önce ➡️ sonra ⬇️ seç.'
      }
    ],
    hints: [
      'Robotun bulunduğu kareden evin olduğu kareye parmağınla çizgi çekmeyi dene. Hangi yöne gidiyorsun?',
      'Görev 1 için bir kez ➡️, Görev 2 için iki kez ➡️ ➡️, Görev 3 için iki kez ➡️ ve bir kez ⬇️ eklemelisin.'
    ],
    completionCriteria: 'En az 2 görevi başarıyla tamamla.',
    badge: 'ilk-algoritmam',
    reflectionQuestion: 'Neyi değiştirdin? Robotun eve varması için okları hangi sırayla dizdin?',
    parentExplanation:
      'Bu etkinlikte çocuğunuz ekran yönleriyle birebir eşleşen okları kullanarak neden-sonuç ve sıralı düşünme becerisini geliştirir.',
    parentConversationPrompt: 'Sence robotun önce hangi yöne gitmesi gerekiyor? Parmağınla yolu gösterir misin?',
    engineType: 'preschool-grid',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-2',
    title: 'Renk Sırasını Tamamla',
    grade: 'anaokulu-3',
    gradeLabel: 'Anaokulu 3 Yaş',
    description:
      'Renkli şekillerin sırasına dikkatle bak ve soru işaretli kutuya gelecek doğru şekli seç.',
    duration: '8–10 dk',
    concepts: ['Örüntü', 'Sıralama'],
    level: 'Başlangıç',
    conceptSummary:
      'Örüntü, şekillerin veya renklerin belirli bir kurala göre sırayla tekrar etmesidir.',
    preschoolNote: 'Bir yetişkinle birlikte keşfedebilirsin.',
    tasks: [
      {
        id: 'e2-g1',
        title: '1. Görev: Kırmızı Daire – Mavi Kare',
        instruction: 'Sırayı incele: Kırmızı Daire, Mavi Kare, Kırmızı Daire... Sırada hangisi var?',
        exampleText: 'Renkleri ve şekilleri yüksek sesle söyle: Daire, Kare, Daire...'
      },
      {
        id: 'e2-g2',
        title: '2. Görev: Sarı Üçgen – Yeşil Yıldız',
        instruction: 'Sarı Üçgen, Yeşil Yıldız, Sarı Üçgen, Yeşil Yıldız... Şimdi hangisi gelmeli?'
      },
      {
        id: 'e2-g3',
        title: '3. Görev: Çift Daire Örüntüsü',
        instruction: 'Kırmızı Daire, Kırmızı Daire, Mavi Kare, Kırmızı Daire, Kırmızı Daire... Sırada ne var?'
      },
      {
        id: 'e2-g4',
        title: '4. Görev: Üçlü Şekil Treni',
        instruction: 'Kırmızı Daire, Mavi Kare, Sarı Üçgen, Kırmızı Daire, Mavi Kare... Trenin son vagonuna hangisi binmeli?'
      }
    ],
    hints: [
      'Şekillerin isimlerini baştan sona yüksek sesle söylemeyi dene. Sesin sana sıradaki şekli fısıldayacak!',
      'Baştaki şekillerin sırası aynen tekrar ediyor. Soru işaretinden önceki şeklin hemen ardına başta ne gelmiş bak.'
    ],
    completionCriteria: 'En az 3 örüntü görevini tamamla.',
    badge: 'ilk-algoritmam',
    reflectionQuestion: 'Neyi değiştirdin? Sıradaki şekli bulurken renge mi yoksa şekle mi baktın?',
    parentExplanation:
      'Örüntü tanıma, ileriki yaşlarda döngü (loop) ve fonksiyon kavramlarının temelini oluşturur. Renklerin yanında şekiller de kullanılarak erişilebilirlik desteklenir.',
    parentConversationPrompt: 'Şekilleri birlikte seslendirelim mi? Sence bu dizide hangi kural tekrar ediyor?',
    engineType: 'pattern-builder',
    hasFreeProduction: true
  },

  // ANAOKULU 4–5 YAŞ
  {
    id: 'etkinlik-3',
    title: 'Hayvan Dostlarıma Yardım Ediyorum',
    grade: 'anaokulu-4-5',
    gradeLabel: 'Anaokulu 4–5 Yaş',
    description:
      '4×4 haritada engellere çarpmadan tavşana havuç, kediye mama ve köpeğe kemik ulaştır.',
    duration: '10–12 dk',
    concepts: ['Algoritma', 'Hata Düzeltme'],
    level: 'Geliştir',
    conceptSummary:
      'Algoritma bir hedefe ulaşmak için kurduğumuz yol planıdır; yanlış adım varsa silip düzeltebiliriz.',
    preschoolNote: 'Bir yetişkinle birlikte keşfedebilirsin.',
    tasks: [
      {
        id: 'e3-g1',
        title: '1. Harita: Tavşana Havuç Götür',
        instruction: '4×4 bahçede robotu sağa ve aşağı yönlendirerek sevimli tavşana ulaştır.',
        exampleText: 'Komutlar kuyruğa eklenir. Yanlış ok eklersen "Son Komutu Sil" düğmesini kullanabilirsin.'
      },
      {
        id: 'e3-g2',
        title: '2. Harita: Taşların Etrafından Kediye Mama',
        instruction: 'Ortadaki gri taşların üzerinden geçemezsin! Taşların etrafından dolaşarak kediye ulaş.'
      },
      {
        id: 'e3-g3',
        title: '3. Harita: Göletleri Aşarak Yavru Köpeğe Ulaş',
        instruction: 'Su birikintilerine basmadan uzun yolu planla ve yavru köpeğe kemiğini götür.'
      }
    ],
    hints: [
      'Taş veya su olan karelere girmemelisin. Robotun her adımda hangi kareye basacağını parmağınla takip et.',
      'Eğer robot engele takılırsa sarı renkle işaretlenen adıma bak; "Son Komutu Sil" ile o adımı değiştir.'
    ],
    completionCriteria: '3 haritanın en az 2 tanesini tamamla.',
    badge: 'ilk-algoritmam',
    reflectionQuestion: 'Neyi değiştirdin? Robot taşlara yaklaştığında hangi komutu değiştirdin?',
    parentExplanation:
      'Çocuğunuz komut kuyruğunu gözlemleyerek soyut planlama yapar ve robot engele takıldığında hangi adımın düzeltilmesi gerektiğini (hata ayıklama) fark eder.',
    parentConversationPrompt: 'Robot engele takıldığında bütün komutları silmek yerine hangi adımı değiştirmemiz yeterli olur?',
    engineType: 'animal-helper-grid',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-4',
    title: 'Robotun Dansı',
    grade: 'anaokulu-4-5',
    gradeLabel: 'Anaokulu 4–5 Yaş',
    description:
      'Hareket kartlarıyla eğlenceli bir dans dizisi oluştur, "2 kez tekrar et" bloğunu dene ve sen de robota katıl!',
    duration: '10 dk',
    concepts: ['Sıralama', 'Tekrar'],
    level: 'Üret',
    conceptSummary:
      'Tekrar komutu, aynı dans hareketlerini yeniden yazmadan arka arkaya yapmamızı sağlar.',
    preschoolNote: 'Bir yetişkinle birlikte keşfedebilirsin.',
    tasks: [
      {
        id: 'e4-g1',
        title: '1. Görev: Selamlama Dansı',
        instruction: 'Sırasıyla "Ellerini Kaldır", "Alkışla" ve "Sağa Adım" kartlarını ekle ve dansı başlat!',
        exampleText: 'Kartlara tıklayarak sahne sırasına ekleyebilirsin.'
      },
      {
        id: 'e4-g2',
        title: '2. Görev: 2 Kez Tekrarlı Ritim',
        instruction: '"Sağa Adım", "Sola Adım" ve "Alkışla" kartlarını ekle, ardından "2 Kez Tekrar Et" seçeneğini açarak çalıştır!'
      },
      {
        id: 'e4-g3',
        title: '3. Görev: Kendi Dansını Tasarla ve Taklit Et',
        instruction: 'En az 4 hareket seç, robotu çalıştır ve ekran karşısında robotla aynı anda dans et!'
      }
    ],
    hints: [
      'Yukarıdaki renkli hareket kartlarına dokunarak dans sırasına ekleyebilirsin.',
      '2. görev için "2 Kez Tekrar Et" düğmesini açık konuma getirmeyi unutma!'
    ],
    completionCriteria: 'En az 2 dans görevini tamamla.',
    badge: 'dongu-kasifi',
    reflectionQuestion: 'Döngü sana nasıl yardımcı oldu? "2 kez tekrar et" açınca robot ne yaptı?',
    parentExplanation:
      'Fiziksel hareketlerle desteklenen bu etkinlik, okul öncesi dönemde döngü (tekrar) kavramını somutlaştırır.',
    parentConversationPrompt: 'Robotun dansını "2 kez tekrar et" düğmesiyle uzattığımızda kaç hareket izledik?',
    engineType: 'robot-dance',
    hasFreeProduction: true
  },

  // 1–2. SINIF
  {
    id: 'etkinlik-5',
    title: 'Hazineye Giden Kod',
    grade: 'sinif-1-2',
    gradeLabel: '1–2. Sınıf',
    description:
      '5×5 haritada robotun bakış yönüne dikkat ederek İleri, Sola Dön ve Sağa Dön komutlarıyla hazine sandığına ulaş.',
    duration: '12–15 dk',
    concepts: ['Algoritma', 'Yön', 'Hata Ayıklama'],
    level: 'Geliştir',
    conceptSummary:
      '"İleri" komutu robotu her zaman baktığı yöne doğru bir kare götürür; yön değiştirmek için önce dönmelisin.',
    tasks: [
      {
        id: 'e5-g1',
        title: '1. Görev: Bakış Yönünü Keşfet',
        instruction: 'Robot sağa bakıyor. İki adım İleri git, sonra Sağa Dön ve bir adım İleri giderek hazineye ulaş.',
        exampleText: 'Dikkat: "Sağa Dön" robotu olduğu yerde döndürür, ilerletmez. İlerlemek için dönüşten sonra "İleri" eklemelisin.'
      },
      {
        id: 'e5-g2',
        title: '2. Görev: Kayalık Geçit',
        instruction: 'Kayalara çarpmadan Sola Dön ve Sağa Dön komutlarını kullanarak hazineye ulaş.'
      },
      {
        id: 'e5-g3',
        title: '3. Görev: İki Farklı Yol',
        instruction: 'Hazineye üst yoldan veya alt yoldan gidebilirsin! İstediğin geçerli bir rotayı kodla.'
      },
      {
        id: 'e5-g4',
        title: '4. Görev: Labirent Ustası',
        instruction: '5×5 haritadaki dar koridordan geçerek altın hazine sandığına ulaş.'
      }
    ],
    hints: [
      'Robotun üzerindeki beyaz ok hangi yöne baktığını gösterir. "Sola Dön" veya "Sağa Dön" yalnızca yönünü değiştirir, kare değiştirmez.',
      'Robot engele çarparsa kırmızı çerçeveyle vurgulanan komuta bak. Dönüş yönünü veya İleri sayısını o adımda düzelt.'
    ],
    completionCriteria: '4 görevden en az 3 tanesini tamamla.',
    badge: 'hata-avcisi',
    reflectionQuestion: 'Neyi değiştirdin? "Sağa Dön" komutu ile "İleri" komutu arasındaki fark nedir?',
    parentExplanation:
      '1–2. sınıfta öğrenciler ekran yönü yerine nesnenin kendi bakış açısına (perspektif alma) göre algoritma kurmayı öğrenirler.',
    parentConversationPrompt: 'Sen robotun yerinde olsaydın ve yüzün o yöne dönük olsaydı, hazine senin sağında mı yoksa solunda mı kalırdı?',
    engineType: 'treasure-robot',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-6',
    title: 'Döngüyle Desen Çiz',
    grade: 'sinif-1-2',
    gradeLabel: '1–2. Sınıf',
    description:
      'Önce tek tek şekil bloklarıyla, ardından "Tekrar Et" döngü bloğuyla daha az kod kullanarak aynı deseni oluştur.',
    duration: '12 dk',
    concepts: ['Döngü', 'Örüntü'],
    level: 'Üret',
    conceptSummary:
      'Döngü (Tekrar Et), aynı komutları defalarca alt alta yazmak yerine tek bir blok içinde tekrarlatmamızı sağlar.',
    tasks: [
      {
        id: 'e6-g1',
        title: '1. Görev: Düz Komutlarla Desen (6 Blok)',
        instruction: 'Hedef deseni (Yıldız - Daire - Yıldız - Daire - Yıldız - Daire) tek tek şekil ekleyerek oluştur.',
        exampleText: 'Önce uzun yolu deneyelim, bir sonraki görevde döngünün gücünü göreceğiz!'
      },
      {
        id: 'e6-g2',
        title: '2. Görev: Aynı Deseni Döngüyle Kur!',
        instruction: 'Şimdi aynı 6 şekillik deseni "3 Kez Tekrar Et [Yıldız, Daire]" döngüsünü kullanarak yalnızca 1 döngü bloğuyla çöz!'
      },
      {
        id: 'e6-g3',
        title: '3. Görev: 4 Tekrarlı Mozaik Kuşağı',
        instruction: 'Hedef desendeki 12 şekli (Üçgen - Kare - Elmas × 4 kez) döngü kullanarak en az blokla oluştur.'
      }
    ],
    hints: [
      'Hedef desende hangi ikili veya üçlü şekil grubunun sürekli tekrar ettiğini bul.',
      'Tekrar eden şekilleri döngü kutusuna seç ve tekrar sayısını 3 veya 4 olarak ayarla.'
    ],
    completionCriteria: 'Hem düz hem döngülü görevleri tamamla.',
    badge: 'dongu-kasifi',
    reflectionQuestion: 'Döngü sana nasıl yardımcı oldu? 1. görev ile 2. görevde kullandığın blok sayısı nasıl değişti?',
    parentExplanation:
      'Öğrencimiz aynı çıktıyı önce uzun yoldan, sonra döngü bloğuyla üreterek kod verimliliğini (daha az blokla aynı iş) bizzat karşılaştırır.',
    parentConversationPrompt: '100 tane Yıldız-Daire çizmemiz gerekseydi tek tek mi eklemek kolay olurdu yoksa döngü sayısını değiştirmek mi?',
    engineType: 'loop-pattern',
    hasFreeProduction: true
  },

  // 3–4. SINIF
  {
    id: 'etkinlik-7',
    title: 'Hikâyemi Kodluyorum',
    grade: 'sinif-3-4',
    gradeLabel: '3–4. Sınıf',
    description:
      'Karakter ve sahne seç, konuşma ve hareket bloklarını sırala, kendi animasyonlu dijital hikâyeni sahnele.',
    duration: '15 dk',
    concepts: ['Olay', 'Sıralama', 'Tekrar'],
    level: 'Üret',
    conceptSummary:
      'Bir program "Başlayınca" olayıyla tetiklenir ve içindeki sahne, hareket, konuşma bloklarını sırasıyla çalıştırır.',
    tasks: [
      {
        id: 'e7-g1',
        title: '1. Görev: Örnek Hikâyeyi İncele ve Çalıştır',
        instruction: 'Hazır yüklenen örnek hikâyeyi "Çalıştır" düğmesiyle izle, ardından konuşma metnini kendi cümlenle değiştir.',
        exampleText: 'Başlayınca → Konuş → Sağa Git → Arka Planı Değiştir bloklarının sırasına dikkat et.'
      },
      {
        id: 'e7-g2',
        title: '2. Görev: Sahne Değişimli Macera',
        instruction: 'En az 1 "Konuş", 1 hareket ("Sağa git" veya "Sola git"), 1 "Arka planı değiştir" ve 1 "Tekrar et" bloğu içeren kendi hikâyeni kur ve oynat.'
      }
    ],
    hints: [
      'Hikâyenin çalışması için en üstte "Başlayınca" bloğu bulunmalıdır. Blokların sırasını yukarı/aşağı oklarla değiştirebilirsin.',
      '2. görev için blok listesinden "Arka planı değiştir" ve "Tekrar et (2 kez)" bloklarını eklediğinden emin ol.'
    ],
    completionCriteria: 'Örnek hikâyeyi düzenle ve kendi sahne değişimli hikâyeni çalıştır.',
    badge: 'oyun-tasarimcisi',
    reflectionQuestion: 'Neyi değiştirdin? Blokların sırasını değiştirdiğinde hikâyenin akışı nasıl etkilendi?',
    parentExplanation:
      'Blok tabanlı hikâye editörü, çocukların algoritma kurarken aynı zamanda yaratıcı yazarlık ve olay örgüsü becerilerini kullanmasını sağlar.',
    parentConversationPrompt: 'Hikâyendeki karakterin önce arka planı değiştirip sonra konuşması ile önce konuşup sonra sahne değiştirmesi arasında nasıl bir fark var?',
    engineType: 'story-editor',
    hasFreeProduction: true
  },
  {
    id: 'etkinlik-8',
    title: 'Hata Dedektifi',
    grade: 'sinif-3-4',
    gradeLabel: '3–4. Sınıf',
    description:
      'Beş farklı senaryoda hatalı kod dizilerini incele, önce sonucu tahmin et, ardından hatayı düzelterek hedefe ulaş.',
    duration: '15 dk',
    concepts: ['Test', 'Hata Ayıklama'],
    level: 'Geliştir',
    conceptSummary:
      'Hata ayıklama (debugging), kodun neden beklenmeyen bir sonuç verdiğini tahmin edip test ederek düzeltme sürecidir.',
    tasks: [
      {
        id: 'e8-g1',
        title: 'Senaryo 1: Eksik Adım Vakası',
        instruction: 'Önce mevcut kodun nereye varacağını tahmin et, çalıştırıp gözlemle ve eksik komutu ekleyerek bayrağa ulaş.'
      },
      {
        id: 'e8-g2',
        title: 'Senaryo 2: Ters Dönüş Hatası',
        instruction: 'Robot yanlış yöne dönüyor! Tahminini seç, kodu test et ve hatalı dönüş bloğunu düzelt.'
      },
      {
        id: 'e8-g3',
        title: 'Senaryo 3: Fazla İlerleme Tuzağı',
        instruction: 'Kodda gereğinden fazla adım var ve robot engele çarpıyor. Tahmin et ve fazla komutu çıkar.'
      },
      {
        id: 'e8-g4',
        title: 'Senaryo 4: Sırası Karışmış Algoritma',
        instruction: 'Komutlar doğru ama sıraları karışmış! Yukarı/aşağı taşıyarak veya düzenleyerek hedefe ulaş.'
      },
      {
        id: 'e8-g5',
        title: 'Senaryo 5: Usta Dedektif Görevi',
        instruction: 'Karmaşık rotadaki iki ayrı hatayı bulup düzelterek enerji kristaline ulaş.'
      }
    ],
    hints: [
      'Önce "1. Adım: Tahmin Et" kutusundan bir tahmin seçmelisin. Ardından kodu çalıştırıp robotun nerede durduğuna bak.',
      'Tek bir doğru yol olmak zorunda değil! Robotu engele çarpmadan hedef kareye ulaştıran her komut dizisi kabul edilir.'
    ],
    completionCriteria: '5 hata senaryosundan en az 4 tanesini çöz.',
    badge: 'hata-avcisi',
    reflectionQuestion: 'Neyi değiştirdin? Kodu çalıştırmadan önce tahmin yapmak hatayı bulmanı nasıl kolaylaştırdı?',
    parentExplanation:
      'Yazılımda ilk denemede hatasız kod yazmak nadir görülür; önemli olan kodu okuyup sonucunu tahmin edebilmek ve hatayı sistematik biçimde onarmaktır.',
    parentConversationPrompt: 'Hatalı kodu tamamen silip baştan yazmak mı daha hızlıydı, yoksa yalnızca hatalı adımı bulup değiştirmek mi?',
    engineType: 'bug-detective',
    hasFreeProduction: false
  },

  // 5–6. SINIF
  {
    id: 'etkinlik-9',
    title: 'Su Yolunu Kodla',
    grade: 'sinif-5-6',
    gradeLabel: '5–6. Sınıf',
    description:
      'Özgün 2B blok dünyasında su kaynağından kurak bahçeye kesintisiz kanal döşe ve suyun akışını test et.',
    duration: '15–18 dk',
    concepts: ['Koordinat', 'Döngü', 'Problemi Parçalara Ayırma'],
    level: 'Geliştir',
    conceptSummary:
      'Büyük bir mühendislik görevini "yatay hat" ve "dikey hat" gibi küçük parçalara ve döngülere bölerek çözebiliriz.',
    tasks: [
      {
        id: 'e9-g1',
        title: '1. Görev: Düz Su Kanalı',
        instruction: 'Su kaynağından (1,2) bahçeye (5,2) kadar her kareye kanal yerleştir ve "Suyu Test Et" ile bahçeyi sula.',
        exampleText: 'İnşaat robotunu ilerletip "Kanal Yerleştir" komutuyla su yolunu tamamla.'
      },
      {
        id: 'e9-g2',
        title: '2. Görev: L Şeklinde Dönüşlü Hat',
        instruction: 'Önce sağa doğru, sonra aşağıya doğru iki ayrı döngü kurarak L şeklindeki su kanalını tamamla.'
      },
      {
        id: 'e9-g3',
        title: '3. Görev: Kayalık Arazide Basamaklı Kanal',
        instruction: 'Kayaların etrafından dolaşan kesintisiz bir su yolu inşa et. Kesinti kalırsa su testi sana koordinatını gösterecek!'
      }
    ],
    hints: [
      'Su kaynağının hemen yanından başlayıp bahçe karesine kadar her ardışık karede (yatay veya dikey komşu) kanal olmalıdır.',
      '"Suyu Test Et" düğmesine bastığında kırmızı ile işaretlenen koordinatta kanal eksik demektir; robotu o kareye götürüp Kanal Yerleştir ekle.'
    ],
    completionCriteria: '3 su kanalı görevinin tamamında suyu bahçeye ulaştır.',
    badge: 'dongu-kasifi',
    reflectionQuestion: 'Döngü sana nasıl yardımcı oldu? Su yolunu hangi küçük parçalara ayırarak kodladın?',
    parentExplanation:
      'Öğrencimiz 2 boyutlu koordinat düzleminde düşünür, tekrar eden inşaat adımlarını döngüye alır ve su akış testiyle kendi çözümünü doğrular.',
    parentConversationPrompt: 'Suyu test ettiğinde kesinti olan koordinatı nasıl tespit ettin?',
    engineType: 'water-channel',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-10',
    title: 'Oyun Tasarım Atölyesi',
    grade: 'sinif-5-6',
    gradeLabel: '5–6. Sınıf',
    description:
      'Karakter, hız, süre, hedef puan ve çarpışma kurallarını kendin belirle; tasarladığın toplama oyununu hemen oyna!',
    duration: '15–20 dk',
    concepts: ['Olay', 'Koşul', 'Değişken'],
    level: 'Üret',
    conceptSummary:
      'Oyunlarda puan ve süre birer değişkendir; "Eğer yıldıza değerse puanı artır" gibi kurallar ise olay ve koşul yapılarıdır.',
    tasks: [
      {
        id: 'e10-g1',
        title: '1. Görev: İlk Kuralını Kur ve Kazan',
        instruction: 'Kural bloklarından "Yıldıza değerse puanı artır" ve "Engele değerse puanı azalt" ayarlarını seç, oyunu başlatıp hedef puana ulaş!',
        exampleText: 'Masaüstünde yön tuşları (veya WASD), tablet ve telefonda ekran üzerindeki yön düğmeleriyle oynayabilirsin.'
      },
      {
        id: 'e10-g2',
        title: '2. Görev: Serbest Oyun Tasarımı ve Denge Testi',
        instruction: 'Serbest Tasarım moduna geç; hızı, süreyi, hedef puanı ve kristal bonus kuralını değiştirerek kendi oyununu test et.'
      }
    ],
    hints: [
      'Oyunu kazanmak için süre bitmeden önce belirlediğin Hedef Puana ulaşmalısın. Sarı yıldızları topla, kırmızı engellerden kaç!',
      'Eğer oyun çok zor olduysa süreyi 25 veya 40 saniyeye çıkarabilir ya da yıldız puanını +2 yapabilirsin.'
    ],
    completionCriteria: 'Görev modunda oyunu kazan ve Serbest Tasarım modunda kendi kurallarınla bir oyun tamamla.',
    badge: 'oyun-tasarimcisi',
    reflectionQuestion: 'Bu kural hangi durumda çalıştı? Hız, süre ve hedef puan değişkenlerini değiştirmek oyunu nasıl etkiledi?',
    parentExplanation:
      'Bu atölyede çocuğunuz hazır bir oyunu yalnızca oynamak yerine oyunun arkasındaki değişkenleri (süre, hız, hedef puan) ve koşullu olay kurallarını yöneten bir oyun tasarımcısı olur.',
    parentConversationPrompt: 'İyi bir oyunun ne çok kolay ne de imkânsız olması için süre ve hız ayarlarını nasıl dengeledin?',
    engineType: 'game-workshop',
    hasFreeProduction: true
  },

  // 7–8. SINIF
  {
    id: 'etkinlik-11',
    title: 'Akıllı Okul Simülatörü',
    grade: 'sinif-7-8',
    gradeLabel: '7–8. Sınıf',
    description:
      'Işık seviyesi ve hareket sensörlerini kullanarak enerji tasarrufu sağlayan akıllı sınıf aydınlatma kuralını kodla ve 4 senaryoda test et.',
    duration: '15 dk',
    concepts: ['Koşul', 'Mantıksal Operatör (VE / VEYA)', 'Girdi–Çıktı'],
    level: 'Geliştir',
    conceptSummary:
      'VE (AND) operatörü yalnızca her iki sensör koşulu da aynı anda doğru olduğunda çıktıyı çalıştırır.',
    tasks: [
      {
        id: 'e11-g1',
        title: '1. Görev: Enerji Tasarruflu Aydınlatma Kuralı',
        instruction: '"EĞER ortam karanlıksa (< 40 lüks) VE sınıfta hareket varsa lambayı AÇ, DEĞİLSE KAPAT" kuralını kur.',
        exampleText: 'VE yerine VEYA kullanırsan gündüz vakti de sınıfta biri varken lambalar gereksiz yanacaktır!'
      },
      {
        id: 'e11-g2',
        title: '2. Görev: 4 Farklı Sensör Senaryosunu Doğrula',
        instruction: 'Gündüz Boş Sınıf, Gündüz Dolu Sınıf, Akşam Boş Sınıf ve Akşam Dolu Sınıf senaryolarının dördünü de test ederek doğrula.'
      }
    ],
    hints: [
      'Lambanın yalnızca hem karanlık (< 40 lüks) hem de hareket (Var) olduğunda yanması için mantıksal operatörü "VE" olarak seçmelisin.',
      'Kuralı doğru kurduktan sonra 4 test senaryosu düğmesine sırayla tıklayarak sistemin her durumda doğru çıktı verdiğini onayla.'
    ],
    completionCriteria: 'Doğru mantıksal kuralı kur ve 4 sensör test senaryosunu başarıyla tamamla.',
    badge: 'kosul-ustasi',
    reflectionQuestion: 'Bu kural hangi durumda çalıştı? Okul koridorlarında "VEYA" yerine "VE" operatörü kullanmak enerji tasarrufuna nasıl katkı sağlar?',
    parentExplanation:
      'Öğrencimiz gerçek hayattaki nesnelerin interneti (IoT) ve akıllı bina sistemlerinin sensör girdilerini (input) mantıksal operatörlerle işleyerek nasıl çıktı (output) ürettiğini deneyimleyerek öğrenir.',
    parentConversationPrompt: 'Evimizde veya okulda sensörlerle çalışan başka hangi sistemler "Eğer ... VE ..." mantığıyla enerji tasarrufu sağlayabilir?',
    engineType: 'smart-school',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-12',
    title: 'Yapay Zekâyı Test Ediyorum',
    grade: 'sinif-7-8',
    gradeLabel: '7–8. Sınıf',
    description:
      'Eğitim simülasyonunda nesneleri özelliklerine göre etiketle, sınıflandırma modelinin yeni nesneleri nasıl tahmin ettiğini ve veri çeşitliliğinin önemini keşfet.',
    duration: '15–18 dk',
    concepts: ['Veri', 'Etiket', 'Tahmin', 'Test ve Önyargı'],
    level: 'Geliştir',
    conceptSummary:
      'Denetimli öğrenmede bir model, insan tarafından etiketlenmiş örnek verilerdeki özellik benzerliklerine bakarak yeni verileri sınıflandırır.',
    tasks: [
      {
        id: 'e12-g1',
        title: '1. Görev: Az ve Tek Tip Veriyle Gözlem Yap',
        instruction: 'Önce yalnızca 2 örneği etiketleyip "Modeli Test Et" düğmesine bas. Az veriyle hangi hataların oluştuğunu gözlemle.',
        exampleText: 'Not: Bu etkinlik, gerçek bir yapay zekâ modelinin eğitim sürecini açıklanabilir yakınlık yöntemiyle basitleştiren bir eğitim simülasyonudur.'
      },
      {
        id: 'e12-g2',
        title: '2. Görev: Dengeli Eğitim Verisiyle Doğruluğu Artır',
        instruction: 'Farklı renk ve boyutlardaki eğitim örneklerini doğru gruplara (Köşeli Şekiller / Yuvarlak Hatlı Şekiller) etiketleyerek 6 test nesnesinin en az 5 tanesini doğru sınıflandır.'
      }
    ],
    hints: [
      'Kuralımız: Köşeli nesneler (Kare, Üçgen, Altıgen) A Grubuna; Yuvarlak hatlı nesneler (Daire, Oval, Halka) B Grubuna aittir.',
      'Eğer yalnızca kırmızı kareleri A grubuna etiketlersen, model mavi bir kare gördüğünde rengine aldanıp hata yapabilir. Her renkten örnek ekle!'
    ],
    completionCriteria: 'Önce eksik veriyi gözlemle, ardından dengeli etiketlemeyle 6 test örneğinden en az 5 doğru tahmin elde et.',
    badge: 'kosul-ustasi',
    reflectionQuestion: 'Neyi değiştirdin? Eğitim verisine farklı renk ve boyutta örnekler eklediğinde tahmin başarısı neden değişti?',
    parentExplanation:
      'Yapay zekâ sihirli bir kutu değildir; kendisine verilen eğitim verisindeki örüntüleri kopyalar. Öğrencimiz eksik veya tek tip veri verildiğinde yapay zekânın nasıl yanıldığını (veri önyargısı) somut olarak gözlemler.',
    parentConversationPrompt: 'Bir yapay zekâ sistemine yalnızca tek tip örnekler öğretilirse gerçek dünyada karşılaştığı farklı durumlarda neden hata yapar?',
    engineType: 'ai-classifier',
    hasFreeProduction: false
  },

  // LİSE
  {
    id: 'etkinlik-13',
    title: 'Algoritma Laboratuvarı',
    grade: 'lise',
    gradeLabel: 'Lise',
    description:
      'Tanımlı sözde kod (pseudocode) yorumlayıcısında değişken tanımla, döngü ve koşulları kur, her adımda değişken tablosunun nasıl güncellendiğini izle.',
    duration: '18–20 dk',
    concepts: ['Değişken', 'Koşul', 'Sınırlı Döngü', 'Adım Adım İzleme (Trace)'],
    level: 'Geliştir',
    conceptSummary:
      'Algoritma izleme (tracing), her satır çalıştığında bellekteki değişkenlerin değerinin nasıl değiştiğini adım adım takip etmektir.',
    tasks: [
      {
        id: 'e13-g1',
        title: '1. Görev: Sınav ve Proje Puanı Hesaplayıcı',
        instruction: 'Başlangıç puanına proje bonusunu ekleyen ve toplam puan 70 veya üzeriyse "Başarılı", değilse "Geliştirilmeli" çıktısı veren algoritmayı tamamla.',
        exampleText: 'Bu çalışma alanı, algoritmik düşünmeyi adım adım görselleştiren kontrollü bir sözde kod (pseudocode) yorumlayıcısıdır.'
      },
      {
        id: 'e13-g2',
        title: '2. Görev: Okul Kulübü Bütçe ve Döngü Simülasyonu',
        instruction: 'Başlangıç bütçesinden N gün boyunca günlük gideri döngüyle düşen ve kalan bütçe 20 TL altına inerse "Bütçe Uyarısı" veren algoritmayı kurup farklı girdilerle test et.'
      },
      {
        id: 'e13-g3',
        title: '3. Görev: Turnuva Toplam Puan Algoritması',
        instruction: 'Sınırlı döngü ve koşul kullanarak her turda kazanılan puanı toplayan ve hedef barajı test eden algoritmayı çalıştır.'
      }
    ],
    hints: [
      'Sağ taraftaki Değişken İzleme Tablosuna (Variable Watch) bakarak her adımda `puan`, `butce` ve `adim` değişkenlerinin aldığı değerleri kontrol et.',
      'Koşul bloğunda eşik değerini (örneğin >= 70 veya < 20) görev açıklamasına uygun seçtiğinden ve ÇIKTI YAZ komutunu eklediğinden emin ol.'
    ],
    completionCriteria: 'En az 2 algoritma görevini farklı test girdileriyle doğrulayarak tamamla.',
    badge: 'kosul-ustasi',
    reflectionQuestion: 'Neyi değiştirdin? Değişkenlerin değerini her adımda tabloda görmek olası mantık hatalarını bulmanı nasıl sağladı?',
    parentExplanation:
      'Lise kademesinde öğrencilerimiz görsel bloklardan yapılandırılmış sözde koda (pseudocode) geçerek değişkenlerin bellekteki durumunu adım adım izleme (state tracing) disiplini kazanırlar.',
    parentConversationPrompt: 'Farklı test girdileri (örneğin sınır değer olan 70 puan) denemek bir yazılımın güvenilirliği için neden önemlidir?',
    engineType: 'algorithm-lab',
    hasFreeProduction: false
  },
  {
    id: 'etkinlik-14',
    title: 'Okul İçin Dijital Çözüm',
    grade: 'lise',
    gradeLabel: 'Lise',
    description:
      'Okul hayatındaki gerçek bir ihtiyacı seç (Odaklanma Zamanlayıcısı veya Mini Bilgi Yarışması), kuralları ve içerikleri yapılandırarak çalışan bir web aracı geliştir.',
    duration: '20 dk',
    concepts: ['Problem Çözme', 'Kullanıcı İhtiyacı', 'Ürün Geliştirme'],
    level: 'Üret',
    conceptSummary:
      'Yazılım geliştirme yalnızca kod yazmak değil; gerçek bir kullanıcı sorununu tanımlayıp çalışan, erişilebilir ve test edilmiş bir ürüne dönüştürmektir.',
    tasks: [
      {
        id: 'e14-g1',
        title: '1. Görev: İhtiyacı Seç ve Aracını Yapılandır',
        instruction: 'Odaklanma Zamanlayıcısı (Pomodoro) veya Mini Bilgi Yarışması şablonundan birini seç; başlığı, süreleri veya soruları düzenle.',
        exampleText: 'Sağdaki canlı önizleme alanında yaptığın tüm değişiklikler anında gerçek bir uygulama olarak çalışır.'
      },
      {
        id: 'e14-g2',
        title: '2. Görev: Canlı Önizlemede Test Et ve Çözümünü Açıkla',
        instruction: 'Oluşturduğun aracı canlı önizlemede çalıştırarak test et ve "Hangi sorunu çözdüm?" alanına projenin amacını yazarak kaydet.'
      }
    ],
    hints: [
      'Zamanlayıcı seçtiysen Başlat, Duraklat ve Sıfırla düğmelerini önizlemede test et; Bilgi Yarışması seçtiysen soruları yanıtlayıp sonuç ekranını gör.',
      '"Hangi sorunu çözdüm?" kutusuna en az bir cümlelik açıklama yazıp "Projemi Kaydet ve Tamamla" düğmesine bas.'
    ],
    completionCriteria: 'Aracını yapılandır, canlı önizlemede test et ve "Hangi sorunu çözdüm?" açıklamasını kaydet.',
    badge: 'oyun-tasarimcisi',
    reflectionQuestion: 'Hangi sorunu çözdün? Geliştirdiğin aracı bir arkadaşın kullansaydı hangi özelliğini geliştirmek isterdin?',
    parentExplanation:
      'Öğrencimiz kodlamayı bir amaç değil, okul ve günlük yaşam problemlerini çözen bir üretim aracı olarak deneyimler ve ürün odaklı düşünme becerisi geliştirir.',
    parentConversationPrompt: 'Tasarladığın bu dijital aracı okulda arkadaşlarının kullanması için hangi özelliğini öne çıkarırdın?',
    engineType: 'digital-solution',
    hasFreeProduction: true
  }
];

export function getActivitiesByGrade(gradeId: string): ActivityDefinition[] {
  return ACTIVITIES.filter((a) => a.grade === gradeId);
}

export function getActivityById(activityId: string): ActivityDefinition | undefined {
  return ACTIVITIES.find((a) => a.id === activityId);
}
