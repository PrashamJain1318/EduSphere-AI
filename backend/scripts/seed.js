import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere');
    console.log('Database Connected for seeding...');

    // Clear existing data
    await Subject.deleteMany();
    await Chapter.deleteMany();
    await Question.deleteMany();
    await Resource.deleteMany();

    console.log('Cleared existing subjects, chapters, questions, and unified resources.');

    // Create Admin User if not exists
    await User.deleteMany({ role: 'admin' });
    const adminUser = await User.create({
      name: 'EduSphere Admin',
      email: 'prashamjaint@gmail.com',
      password: '1234@1234', // Will be hashed automatically by pre-save middleware
      role: 'admin',
    });
    console.log('Created Admin User: prashamjaint@gmail.com / 1234@1234');

    // ----------------------------------------------------
    // SEED CLASS 10 SUBJECTS & CHAPTERS
    // ----------------------------------------------------

    // 1. Mathematics
    const math10 = await Subject.create({ name: 'Mathematics', class: '10', code: 'MATH-10' });
    const mathChaps = [
      'Real Numbers', 'Polynomials', 'Pair of Linear Equations',
      'Quadratic Equations', 'Arithmetic Progressions', 'Triangles',
      'Coordinate Geometry', 'Trigonometry', 'Statistics', 'Probability'
    ];
    const createdMathChaps = [];
    for (let i = 0; i < mathChaps.length; i++) {
      const c = await Chapter.create({ subjectId: math10._id, name: mathChaps[i], order: i + 1 });
      createdMathChaps.push(c);
    }

    // 2. Physics
    const physics10 = await Subject.create({ name: 'Physics', class: '10', code: 'PHY-10' });
    const physicsChaps = [
      'Light Reflection and Refraction', 'Human Eye', 'Electricity',
      'Magnetic Effects of Current', 'Sources of Energy'
    ];
    const createdPhysicsChaps = [];
    for (let i = 0; i < physicsChaps.length; i++) {
      const c = await Chapter.create({ subjectId: physics10._id, name: physicsChaps[i], order: i + 1 });
      createdPhysicsChaps.push(c);
    }

    // 3. Chemistry
    const chemistry10 = await Subject.create({ name: 'Chemistry', class: '10', code: 'CHEM-10' });
    const chemistryChaps = [
      'Chemical Reactions', 'Acids Bases and Salts', 'Metals and Non Metals',
      'Carbon and Compounds', 'Periodic Classification'
    ];
    const createdChemistryChaps = [];
    for (let i = 0; i < chemistryChaps.length; i++) {
      const c = await Chapter.create({ subjectId: chemistry10._id, name: chemistryChaps[i], order: i + 1 });
      createdChemistryChaps.push(c);
    }

    // 4. Biology
    const biology10 = await Subject.create({ name: 'Biology', class: '10', code: 'BIO-10' });
    const biologyChaps = [
      'Life Processes', 'Control and Coordination', 'Reproduction',
      'Heredity', 'Our Environment'
    ];
    const createdBiologyChaps = [];
    for (let i = 0; i < biologyChaps.length; i++) {
      const c = await Chapter.create({ subjectId: biology10._id, name: biologyChaps[i], order: i + 1 });
      createdBiologyChaps.push(c);
    }

    // 5. History
    const history10 = await Subject.create({ name: 'History', class: '10', code: 'SST-HIST-10' });
    const historyChaps = [
      'The Rise of Nationalism in Europe',
      'Nationalism in India',
      'The Making of a Global World',
      'The Age of Industrialisation',
      'Print Culture and the Modern World'
    ];
    const createdHistoryChaps = [];
    for (let i = 0; i < historyChaps.length; i++) {
      const c = await Chapter.create({ subjectId: history10._id, name: historyChaps[i], order: i + 1 });
      createdHistoryChaps.push(c);
    }

    // 6. Civics
    const civics10 = await Subject.create({ name: 'Civics (Political Science)', class: '10', code: 'SST-CIV-10' });
    const civicsChaps = [
      'Power Sharing',
      'Federalism',
      'Gender, Religion and Caste',
      'Political Parties',
      'Outcomes of Democracy'
    ];
    const createdCivicsChaps = [];
    for (let i = 0; i < civicsChaps.length; i++) {
      const c = await Chapter.create({ subjectId: civics10._id, name: civicsChaps[i], order: i + 1 });
      createdCivicsChaps.push(c);
    }

    // 7. Geography
    const geography10 = await Subject.create({ name: 'Geography', class: '10', code: 'SST-GEO-10' });
    const geographyChaps = [
      'Resources and Development',
      'Forest and Wildlife Resources',
      'Water Resources',
      'Agriculture',
      'Minerals and Energy Resources',
      'Manufacturing Industries',
      'Lifelines of National Economy'
    ];
    const createdGeographyChaps = [];
    for (let i = 0; i < geographyChaps.length; i++) {
      const c = await Chapter.create({ subjectId: geography10._id, name: geographyChaps[i], order: i + 1 });
      createdGeographyChaps.push(c);
    }

    // 8. Economics
    const economics10 = await Subject.create({ name: 'Economics', class: '10', code: 'SST-ECON-10' });
    const economicsChaps = [
      'Development',
      'Sectors of the Indian Economy',
      'Money and Credit',
      'Globalisation and the Indian Economy',
      'Consumer Rights'
    ];
    const createdEconomicsChaps = [];
    for (let i = 0; i < economicsChaps.length; i++) {
      const c = await Chapter.create({ subjectId: economics10._id, name: economicsChaps[i], order: i + 1 });
      createdEconomicsChaps.push(c);
    }

    // 9. English
    const english10 = await Subject.create({ name: 'English', class: '10', code: 'ENG-10' });
    
    const firstFlightChaps = [
      'A Letter to God',
      'Nelson Mandela: Long Walk to Freedom',
      'Stories About Flying',
      'From the Diary of Anne Frank',
      'Glimpses of India',
      'Mijbil the Otter',
      'Madam Rides the Bus',
      'The Sermon at Benares',
      'The Proposal'
    ];
    const createdFirstFlight = [];
    for (let i = 0; i < firstFlightChaps.length; i++) {
      const c = await Chapter.create({
        subjectId: english10._id,
        name: firstFlightChaps[i],
        section: 'First Flight',
        order: i + 1
      });
      createdFirstFlight.push(c);
    }

    const poemsChaps = [
      'Dust of Snow',
      'Fire and Ice',
      'A Tiger in the Zoo',
      'How to Tell Wild Animals',
      'The Ball Poem',
      'Amanda!',
      'The Trees',
      'Fog',
      'The Tale of Custard the Dragon',
      'For Anne Gregory'
    ];
    const createdPoems = [];
    for (let i = 0; i < poemsChaps.length; i++) {
      const c = await Chapter.create({
        subjectId: english10._id,
        name: poemsChaps[i],
        section: 'Poems',
        order: i + 1
      });
      createdPoems.push(c);
    }

    const footprintsChaps = [
      'A Triumph of Surgery',
      'The Thief\'s Story',
      'The Midnight Visitor',
      'A Question of Trust',
      'Footprints Without Feet',
      'The Making of a Scientist',
      'The Necklace',
      'Bholi',
      'The Book That Saved the Earth'
    ];
    const createdFootprints = [];
    for (let i = 0; i < footprintsChaps.length; i++) {
      const c = await Chapter.create({
        subjectId: english10._id,
        name: footprintsChaps[i],
        section: 'Footprints Without Feet',
        order: i + 1
      });
      createdFootprints.push(c);
    }

    const allEnglishChaps = [...createdFirstFlight, ...createdPoems, ...createdFootprints];
    const dummyPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    // Seed Notes, PYQs, board papers, and revision shorts for all 28 chapters programmatically
    for (const chap of allEnglishChaps) {
      // Notes
      await Resource.create({
        title: `${chap.name} Study Notes`,
        description: `Comprehensive guide and study notes for chapter: ${chap.name}.`,
        pdfUrl: dummyPdf,
        subjectId: english10._id,
        chapterId: chap._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      });

      // PYQs
      await Resource.create({
        title: `${chap.name} Solved PYQs`,
        pdfUrl: dummyPdf,
        subjectId: english10._id,
        chapterId: chap._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      });

      // Papers
      await Resource.create({
        title: `CBSE Board ${chap.name} Paper 2026`,
        pdfUrl: dummyPdf,
        solutionPdfUrl: dummyPdf,
        board: 'CBSE',
        year: 2026,
        subjectId: english10._id,
        chapterId: chap._id,
        class: '10',
        resourceType: 'paper',
        uploadedBy: adminUser._id,
      });

      // Shorts
      await Resource.create({
        title: `${chap.name} Revision Short`,
        description: `Quick 1-minute recap of ${chap.name}.`,
        videoUrl: 'https://youtube.com/shorts/sample-short',
        youtubeVideoId: 'sample-short',
        thumbnail: 'https://img.youtube.com/vi/sample-short/hqdefault.jpg',
        duration: '01:00',
        subjectId: english10._id,
        chapterId: chap._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      });

      // Video Lectures
      let vids = [];
      const cname = chap.name;

      // First Flight
      if (cname === 'A Letter to God') {
        vids = [{ title: 'Main Lecture', id: '2w6r4mWykIE' }, { title: 'Kriti Di Lecture', id: '37fvYZ8pb10' }];
      } else if (cname === 'Nelson Mandela: Long Walk to Freedom') {
        vids = [{ title: 'Main Lecture', id: 'UXpLYES-n3o' }, { title: 'Kriti Di Lecture', id: 'Sc-iGYFqH5w' }];
      } else if (cname === 'Stories About Flying') {
        vids = [{ title: 'Main Lecture', id: 'DCqd00umZ0g' }, { title: 'Kriti Di Lecture', id: 'l9l4RdikVGY' }];
      } else if (cname === 'From the Diary of Anne Frank') {
        vids = [{ title: 'Main Lecture', id: 'fc7QwZ_JMyI' }, { title: 'Kriti Di Lecture', id: 'JM2ekHhvIWs' }];
      } else if (cname === 'Glimpses of India') {
        vids = [{ title: 'Part 1', id: 'rKeRU4s8e_8' }, { title: 'Part 2', id: 'LWWpoM_U9iw' }, { title: 'Part 3', id: '91mmR37Ma3M' }, { title: 'Kriti Di Lecture', id: '_EIF5nPScc0' }];
      } else if (cname === 'Mijbil the Otter') {
        vids = [{ title: 'Main Lecture', id: 'jyBbUsk-8Ic' }, { title: 'Kriti Di Lecture', id: 'BYA0MDdmudw' }];
      } else if (cname === 'Madam Rides the Bus') {
        vids = [{ title: 'Main Lecture', id: 'CXKVT_8z_IA' }, { title: 'Kriti Di Lecture', id: 'jJGJICYVo6Q' }];
      } else if (cname === 'The Sermon at Benares') {
        vids = [{ title: 'Main Lecture', id: 'SfzWqWwrwyU' }, { title: 'Kriti Di Lecture', id: '_fNJz_RgzRc' }];
      } else if (cname === 'The Proposal') {
        vids = [{ title: 'Main Lecture', id: '3_B9T9Y5c9c' }, { title: 'Kriti Di Lecture', id: 'owj-G3ACjWw' }];
      }
      // Poems
      else if (cname === 'Dust of Snow') {
        vids = [{ title: 'Main Lecture', id: 'CpZRRMwC8n8' }, { title: 'Kriti Di Lecture', id: 'jboE6me8n4Y' }];
      } else if (cname === 'Fire and Ice') {
        vids = [{ title: 'Main Lecture', id: 'h1d-P4QAd1c' }];
      } else if (cname === 'A Tiger in the Zoo') {
        vids = [{ title: 'Main Lecture', id: '1uiadsWxsXo' }];
      } else if (cname === 'How to Tell Wild Animals') {
        vids = [{ title: 'Main Lecture', id: '8YTgFlQ6hKE' }, { title: 'Kriti Di Lecture', id: '0bibkaAFwQU' }];
      } else if (cname === 'The Ball Poem') {
        vids = [{ title: 'Main Lecture', id: '0a9koAPHvoM' }];
      } else if (cname === 'Amanda!') {
        vids = [{ title: 'Main Lecture', id: 'IE32QU_Lrz8' }];
      } else if (cname === 'The Trees') {
        vids = [{ title: 'Main Lecture', id: 'VuVEqovwCIA' }, { title: 'Kriti Di Lecture', id: 'eLFFAMfM8pM' }];
      } else if (cname === 'Fog') {
        vids = [{ title: 'Main Lecture', id: 'rM_aPk5G470' }];
      } else if (cname === 'The Tale of Custard the Dragon') {
        vids = [{ title: 'Main Lecture', id: 'h_QwDoVkFtg' }, { title: 'Kriti Di Lecture', id: 'Ei3vfGhX9f4' }];
      } else if (cname === 'For Anne Gregory') {
        vids = [{ title: 'Main Lecture', id: 'nFU0YmmM4Lk' }];
      }
      // Footprints Without Feet
      else if (cname === 'A Triumph of Surgery') {
        vids = [{ title: 'Main Lecture', id: 'w9FpgW5I1Io' }, { title: 'Kriti Di Lecture', id: 'lP6rg3UmNSY' }];
      } else if (cname === 'The Thief\'s Story') {
        vids = [{ title: 'Main Lecture', id: '4sZl3KPBD_A' }, { title: 'Part 2 Lecture', id: 'AdrjDRHcz5w' }, { title: 'Kriti Di Lecture', id: '8T7ER7LSVWU' }];
      } else if (cname === 'The Midnight Visitor') {
        vids = [{ title: 'Kriti Di Lecture', id: 'NtND5TsNvQ0' }];
      } else if (cname === 'A Question of Trust') {
        vids = [{ title: 'Main Lecture', id: 'g68_SHwGC-o' }, { title: 'Kriti Di Lecture', id: '2MfevcLfj9A' }];
      } else if (cname === 'Footprints Without Feet') {
        vids = [{ title: 'Main Lecture', id: 'oszdnvwDfTQ' }, { title: 'Kriti Di Lecture', id: 'gr4WQLsqlqw' }];
      } else if (cname === 'The Making of a Scientist') {
        vids = [{ title: 'Main Lecture', id: '64PaWs5BZ8Q' }, { title: 'Kriti Di Lecture', id: 'XcrFbkodB3E' }];
      } else if (cname === 'The Necklace') {
        vids = [{ title: 'Main Lecture', id: 'TtZMjKuuF4Q' }, { title: 'Kriti Di Lecture', id: 'vR3mtDk3SDw' }];
      } else if (cname === 'Bholi') {
        vids = [{ title: 'Main Lecture', id: 'V3GnocR2-0o' }, { title: 'Kriti Di Lecture', id: '20Bwch3ar2Q' }];
      } else if (cname === 'The Book That Saved the Earth') {
        vids = [{ title: 'Main Lecture', id: 'Si8uiDGqSrw' }, { title: 'Kriti Di Lecture', id: 'u8OBAg73SJ0' }];
      } else {
        vids = [{ title: 'Main Lecture', id: `vid${chap._id.toString().slice(-7)}a` }];
      }

      for (const v of vids) {
        await Resource.create({
          title: v.title,
          description: `Lecture video for ${chap.name}: ${v.title}.`,
          videoUrl: `https://youtu.be/${v.id}`,
          youtubeVideoId: v.id,
          thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
          duration: '15:00',
          subjectId: english10._id,
          chapterId: chap._id,
          category: 'lectures',
          class: '10',
          resourceType: 'video',
          uploadedBy: adminUser._id,
        });
      }
    }

    // 10. Hindi A
    const hindiA10 = await Subject.create({ name: 'Hindi A', class: '10', code: 'HIN-A-10' });
    const hindiAChaps = ['Netaji Ka Chashma', 'Balgobin Bhagat', 'Lakhnavi Andaz'];
    for (let i = 0; i < hindiAChaps.length; i++) {
      await Chapter.create({ subjectId: hindiA10._id, name: hindiAChaps[i], order: i + 1 });
    }

    // 11. Hindi B
    const hindiB10 = await Subject.create({ name: 'Hindi B', class: '10', code: 'HIN-B-10' });
    const hindiBChaps = ['Bade Bhai Sahab', 'Diary Ka Ek Panna', 'Tatara Vamiro Katha'];
    for (let i = 0; i < hindiBChaps.length; i++) {
      await Chapter.create({ subjectId: hindiB10._id, name: hindiBChaps[i], order: i + 1 });
    }

    // 12. Sanskrit
    const sanskrit10 = await Subject.create({ name: 'Sanskrit', class: '10', code: 'SAN-10' });
    const sanskritChaps = ['Shuchiparyavaranam', 'Buddhirbalavati Sada', 'Janani Tulyavatsala'];
    for (let i = 0; i < sanskritChaps.length; i++) {
      await Chapter.create({ subjectId: sanskrit10._id, name: sanskritChaps[i], order: i + 1 });
    }

    console.log('Seeded all Class 10 subjects and chapters successfully.');

    // ----------------------------------------------------
    // SEED CLASS 12 SUBJECTS & CHAPTERS
    // ----------------------------------------------------

    // 1. Physics Class 12 (Science)
    const physics12 = await Subject.create({
      name: 'Physics',
      class: '12',
      stream: 'Science',
      code: 'PHY-12',
    });
    const physics12Chaps = [
      { name: 'Electrostatic Potential and Capacitance', order: 1 },
      { name: 'Current Electricity', order: 2 },
      { name: 'Moving Charges and Magnetism', order: 3 },
    ];
    for (const chap of physics12Chaps) {
      await Chapter.create({ subjectId: physics12._id, ...chap });
    }

    // 2. Accountancy Class 12 (Commerce)
    const accounts12 = await Subject.create({
      name: 'Accountancy',
      class: '12',
      stream: 'Commerce',
      code: 'ACC-12',
    });
    await Chapter.create({ subjectId: accounts12._id, name: 'Accounting for Partnership Firms', order: 1 });
    await Chapter.create({ subjectId: accounts12._id, name: 'Issue of Shares', order: 2 });

    // 3. Political Science Class 12 (Humanities)
    const polsci12 = await Subject.create({
      name: 'Political Science',
      class: '12',
      stream: 'Humanities',
      code: 'POL-12',
    });
    await Chapter.create({ subjectId: polsci12._id, name: 'Cold War Era', order: 1 });
    await Chapter.create({ subjectId: polsci12._id, name: 'The End of Bipolarity', order: 2 });

    console.log('Seeded Class 12 core subjects and chapters.');

    // ----------------------------------------------------
    // SEED PRACTICE QUESTIONS
    // ----------------------------------------------------
    const targetMathChapter = createdMathChaps[0]; // Real Numbers
    const sampleQuestions = [
      {
        subjectId: math10._id,
        chapterId: targetMathChapter._id,
        difficulty: 'easy',
        question: 'What is the HCF of 135 and 225?',
        options: ['15', '30', '45', '60'],
        correctAnswer: 2,
        explanation: 'Using Euclid\'s division algorithm: 225 = 135 * 1 + 90, 135 = 90 * 1 + 45, 90 = 45 * 2 + 0. So, HCF is 45.',
      },
      {
        subjectId: math10._id,
        chapterId: targetMathChapter._id,
        difficulty: 'medium',
        question: 'If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, where x, y are prime numbers, then HCF(a, b) is:',
        options: ['xy', 'x y^2', 'x^3 y^3', 'x^2 y^2'],
        correctAnswer: 1,
        explanation: 'HCF is the product of the lowest power of common factors. HCF = x^1 * y^2 = x y^2.',
      },
    ];

    for (const q of sampleQuestions) {
      await Question.create(q);
    }
    console.log('Seeded sample Mathematics practice questions.');

    // ----------------------------------------------------
    // SEED VIDEOS
    // ----------------------------------------------------
    const sstDummyUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const sstDummyId = 'dQw4w9WgXcQ';
    const sstDummyThumb = `https://img.youtube.com/vi/${sstDummyId}/hqdefault.jpg`;

    const sampleVideos = [
      // Physics Video
      {
        title: 'Full Lecture: Light Reflection and Refraction',
        description: 'Complete board-oriented detailed lecture covering mirrors, lens formulas, and signs conventions.',
        videoUrl: 'https://www.youtube.com/watch?v=g-5W5v-3Y78',
        youtubeVideoId: 'g-5W5v-3Y78',
        thumbnail: 'https://img.youtube.com/vi/g-5W5v-3Y78/hqdefault.jpg',
        duration: '45:30',
        subjectId: physics10._id,
        chapterId: createdPhysicsChaps[0]._id, // Light
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // Chemistry Video
      {
        title: 'Full Lecture: Chemical Reactions & Equations',
        description: 'Detailed analysis of balancing chemical equations, types of reactions, and redox concepts.',
        videoUrl: 'https://www.youtube.com/watch?v=g-5W5v-3Y78',
        youtubeVideoId: 'g-5W5v-3Y78',
        thumbnail: 'https://img.youtube.com/vi/g-5W5v-3Y78/hqdefault.jpg',
        duration: '38:15',
        subjectId: chemistry10._id,
        chapterId: createdChemistryChaps[0]._id, // Chemical Reactions
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // Biology Video
      {
        title: 'Full Lecture: Life Processes - Nutrition & Respiration',
        description: 'Detailing human digestive systems, autotrophic nutrition, and aerobic respiration cycles.',
        videoUrl: 'https://www.youtube.com/watch?v=2Juem0lc5gc',
        youtubeVideoId: '2Juem0lc5gc',
        thumbnail: 'https://img.youtube.com/vi/2Juem0lc5gc/hqdefault.jpg',
        duration: '50:40',
        subjectId: biology10._id,
        chapterId: createdBiologyChaps[0]._id, // Life Processes
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // History Videos
      {
        title: 'The Rise of Nationalism in Europe Complete Lecture',
        description: 'Complete lecture covering the French Revolution, the making of nationalism, and the unification of Italy and Germany.',
        videoUrl: 'https://youtu.be/ksTPzTWUb6o',
        youtubeVideoId: 'ksTPzTWUb6o',
        thumbnail: 'https://img.youtube.com/vi/ksTPzTWUb6o/hqdefault.jpg',
        duration: '45:30',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[0]._id, // Chapter 1: The Rise of Nationalism in Europe
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Nationalism in India Complete Lecture',
        description: 'Comprehensive board-oriented study covering Rowlatt Act, Jallianwala Bagh, and Salt March.',
        videoUrl: 'https://youtu.be/aUY1iZ85l4I',
        youtubeVideoId: 'aUY1iZ85l4I',
        thumbnail: 'https://img.youtube.com/vi/aUY1iZ85l4I/hqdefault.jpg',
        duration: '48:15',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[1]._id, // Chapter 2: Nationalism in India
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Making of a Global World Complete Lecture',
        description: 'Exploring the pre-modern world, the nineteenth century economy, and the inter-war economy.',
        videoUrl: 'https://youtu.be/aOGabO1zrsU',
        youtubeVideoId: 'aOGabO1zrsU',
        thumbnail: 'https://img.youtube.com/vi/aOGabO1zrsU/hqdefault.jpg',
        duration: '40:20',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[2]._id, // Chapter 3: The Making of a Global World
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Age of Industrialisation Complete Lecture',
        description: 'Detailed analysis of the proto-industrialisation era, factory setups, and industrial growth.',
        videoUrl: 'https://youtu.be/JUJx3GAghZs',
        youtubeVideoId: 'JUJx3GAghZs',
        thumbnail: 'https://img.youtube.com/vi/JUJx3GAghZs/hqdefault.jpg',
        duration: '42:50',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[3]._id, // Chapter 4: The Age of Industrialisation
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Print Culture and the Modern World Complete Lecture',
        description: 'Tracing print history from East Asia to Europe, the print revolution, and its impact on India.',
        videoUrl: 'https://youtu.be/4ngYj9LkSw8',
        youtubeVideoId: '4ngYj9LkSw8',
        thumbnail: 'https://img.youtube.com/vi/4ngYj9LkSw8/hqdefault.jpg',
        duration: '50:15',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[4]._id, // Chapter 5: Print Culture and the Modern World
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // Civics Videos
      {
        title: 'Power Sharing Complete Lecture',
        description: 'Detailed analysis of Power Sharing mechanisms in Belgium and Sri Lanka.',
        videoUrl: 'https://www.youtube.com/watch?v=jlnlP_2dW5M',
        youtubeVideoId: 'jlnlP_2dW5M',
        thumbnail: 'https://img.youtube.com/vi/jlnlP_2dW5M/hqdefault.jpg',
        duration: '45:10',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[0]._id, // Chapter 1: Power Sharing
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Federalism Complete Lecture',
        description: 'Detailed lecture explaining what federalism is and how it is practiced in India.',
        videoUrl: 'https://www.youtube.com/watch?v=sEK76uqgJOA',
        youtubeVideoId: 'sEK76uqgJOA',
        thumbnail: 'https://img.youtube.com/vi/sEK76uqgJOA/hqdefault.jpg',
        duration: '40:15',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[1]._id, // Chapter 2: Federalism
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Gender, Religion and Caste Complete Lecture',
        description: 'Examining social division based on gender, religion, and caste in politics.',
        videoUrl: 'https://www.youtube.com/watch?v=-vcz2so9A-I',
        youtubeVideoId: '-vcz2so9A-I',
        thumbnail: 'https://img.youtube.com/vi/-vcz2so9A-I/hqdefault.jpg',
        duration: '52:20',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[2]._id, // Chapter 3: Gender, Religion and Caste
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Political Parties Complete Lecture',
        description: 'Why do we need political parties? How many parties should we have?',
        videoUrl: 'https://www.youtube.com/watch?v=YYKmkrWPSi8',
        youtubeVideoId: 'YYKmkrWPSi8',
        thumbnail: 'https://img.youtube.com/vi/YYKmkrWPSi8/hqdefault.jpg',
        duration: '48:30',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[3]._id, // Chapter 4: Political Parties
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Outcomes of Democracy Complete Lecture',
        description: 'How do we assess democracy outcomes? Accountable, responsive and legitimate government.',
        videoUrl: 'https://www.youtube.com/watch?v=D6qV-NCx0pk',
        youtubeVideoId: 'D6qV-NCx0pk',
        thumbnail: 'https://img.youtube.com/vi/D6qV-NCx0pk/hqdefault.jpg',
        duration: '35:50',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[4]._id, // Chapter 5: Outcomes of Democracy
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // Geography Videos
      {
        title: 'Resources and Development Part 1',
        description: 'Introduction to resources and development planning in India.',
        videoUrl: 'https://youtu.be/czJ1qAusGa8',
        youtubeVideoId: 'czJ1qAusGa8',
        thumbnail: 'https://img.youtube.com/vi/czJ1qAusGa8/hqdefault.jpg',
        duration: '35:20',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id, // Chapter 1: Resources and Development
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Resources and Development Part 2',
        description: 'Deep dive into soil classification and conservation of resources.',
        videoUrl: 'https://youtu.be/QvVZ6Cvnwrc',
        youtubeVideoId: 'QvVZ6Cvnwrc',
        thumbnail: 'https://img.youtube.com/vi/QvVZ6Cvnwrc/hqdefault.jpg',
        duration: '40:15',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id, // Chapter 1: Resources and Development
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Forest and Wildlife Resources Complete Lecture',
        description: 'Flora and fauna classification, depletion, and conservation of forests and wildlife.',
        videoUrl: 'https://youtu.be/zR526dbscZg',
        youtubeVideoId: 'zR526dbscZg',
        thumbnail: 'https://img.youtube.com/vi/zR526dbscZg/hqdefault.jpg',
        duration: '42:10',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[1]._id, // Chapter 2: Forest and Wildlife Resources
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Water Resources Complete Lecture',
        description: 'Water scarcity, water resource management, and multi-purpose river projects.',
        videoUrl: 'https://youtu.be/0icCbK1IT2g',
        youtubeVideoId: '0icCbK1IT2g',
        thumbnail: 'https://img.youtube.com/vi/0icCbK1IT2g/hqdefault.jpg',
        duration: '38:45',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[2]._id, // Chapter 3: Water Resources
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Agriculture Complete Lecture',
        description: 'Types of farming, cropping patterns, major crops, and technological reforms.',
        videoUrl: 'https://youtu.be/VgJ-zRAdvaE',
        youtubeVideoId: 'VgJ-zRAdvaE',
        thumbnail: 'https://img.youtube.com/vi/VgJ-zRAdvaE/hqdefault.jpg',
        duration: '45:12',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[3]._id, // Chapter 4: Agriculture
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Minerals and Energy Resources Complete Lecture',
        description: 'Mode of occurrence of minerals, ferrous/non-ferrous, and conventional/non-conventional energy.',
        videoUrl: 'https://youtu.be/yJ559nLmHyY',
        youtubeVideoId: 'yJ559nLmHyY',
        thumbnail: 'https://img.youtube.com/vi/yJ559nLmHyY/hqdefault.jpg',
        duration: '50:30',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[4]._id, // Chapter 5: Minerals and Energy Resources
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Manufacturing Industries Complete Lecture',
        description: 'Importance of manufacturing, industrial location, classification, and pollution controls.',
        videoUrl: 'https://youtu.be/squfJHQkm5A',
        youtubeVideoId: 'squfJHQkm5A',
        thumbnail: 'https://img.youtube.com/vi/squfJHQkm5A/hqdefault.jpg',
        duration: '48:20',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[5]._id, // Chapter 6: Manufacturing Industries
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Lifelines of National Economy Complete Lecture',
        description: 'Transport systems (roadways, railways, pipelines, waterways, airways) and communication/trade.',
        videoUrl: 'https://youtu.be/GL0jycoqmuo',
        youtubeVideoId: 'GL0jycoqmuo',
        thumbnail: 'https://img.youtube.com/vi/GL0jycoqmuo/hqdefault.jpg',
        duration: '52:10',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[6]._id, // Chapter 7: Lifelines of National Economy
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      // Economics Videos
      {
        title: 'Development Complete Lecture',
        description: 'Key developmental promises, national development, and measuring income indicators.',
        videoUrl: 'https://youtu.be/CPrly1Dp_4o',
        youtubeVideoId: 'CPrly1Dp_4o',
        thumbnail: 'https://img.youtube.com/vi/CPrly1Dp_4o/hqdefault.jpg',
        duration: '35:45',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[0]._id, // Chapter 1: Development
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Sectors of the Indian Economy Complete Lecture',
        description: 'Primary, secondary, and tertiary sectors, division of organized/unorganized, and ownership public/private.',
        videoUrl: 'https://youtu.be/GD6x2Nc_zfI',
        youtubeVideoId: 'GD6x2Nc_zfI',
        thumbnail: 'https://img.youtube.com/vi/GD6x2Nc_zfI/hqdefault.jpg',
        duration: '44:30',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[1]._id, // Chapter 2: Sectors of the Indian Economy
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Money and Credit Complete Lecture',
        description: 'Money as a medium of exchange, modern forms, formal and informal sources of credit in India.',
        videoUrl: 'https://youtu.be/VV_iJ8y7sCY',
        youtubeVideoId: 'VV_iJ8y7sCY',
        thumbnail: 'https://img.youtube.com/vi/VV_iJ8y7sCY/hqdefault.jpg',
        duration: '42:15',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[2]._id, // Chapter 3: Money and Credit
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Globalisation and the Indian Economy Complete Lecture',
        description: 'Production across countries, MNCs, integration of markets, and impact of globalisation.',
        videoUrl: 'https://youtu.be/p1D7yjo5Vfs',
        youtubeVideoId: 'p1D7yjo5Vfs',
        thumbnail: 'https://img.youtube.com/vi/p1D7yjo5Vfs/hqdefault.jpg',
        duration: '48:50',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[3]._id, // Chapter 4: Globalisation and the Indian Economy
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Consumer Rights Complete Lecture',
        description: 'Consumer awareness, exploitation, and consumer forums/rights in India.',
        videoUrl: 'https://youtu.be/tVCI5of6alE',
        youtubeVideoId: 'tVCI5of6alE',
        thumbnail: 'https://img.youtube.com/vi/tVCI5of6alE/hqdefault.jpg',
        duration: '38:10',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[4]._id, // Chapter 5: Consumer Rights
        category: 'lectures',
        class: '10',
        stream: null,
        resourceType: 'video',
        uploadedBy: adminUser._id,
      },
    ];

    for (const v of sampleVideos) {
      await Resource.create(v);
    }
    console.log('Seeded sample board video lectures.');

    // ----------------------------------------------------
    // SEED NOTES
    // ----------------------------------------------------

    await Resource.create([
      {
        title: 'Light Reflection Formula Sheet',
        description: 'Mirror formula, magnification, and light refraction index summaries.',
        pdfUrl: dummyPdf,
        subjectId: physics10._id,
        chapterId: createdPhysicsChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Chemical Reactions Core Concepts',
        description: 'Summary of types of chemical reactions, equations, oxidation, and reduction.',
        pdfUrl: dummyPdf,
        subjectId: chemistry10._id,
        chapterId: createdChemistryChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Rise of Nationalism in Europe Core Notes',
        description: 'French Revolution and the idea of the nation, making of nationalism, and revolutions timeline.',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Nationalism in India Revision Notes',
        description: 'First World War, Khilafat and Non-Cooperation, and Civil Disobedience details.',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[1]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Making of a Global World Core Notes',
        description: 'Pre-modern world trade, silk routes, colonialism, and inter-war economy breakdown.',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[2]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Age of Industrialisation Core Notes',
        description: 'Proto-industrialisation, factories setup, labor demands, and industrial growth in India.',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[3]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Print Culture and the Modern World Notes',
        description: 'First printed books, print coming to Europe, print revolution and public sphere debates.',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[4]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Power Sharing Core Notes',
        description: 'Ethnic composition and why power sharing is desirable.',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Federalism Core Notes',
        description: 'Key features of federalism and how federalism is practiced in India.',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[1]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Gender, Religion and Caste Core Notes',
        description: 'Gender division, religion in politics, and caste inequality in democratic processes.',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[2]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Political Parties Core Notes',
        description: 'Need for political parties, multi-party system, and national/regional parties.',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[3]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Outcomes of Democracy Core Notes',
        description: 'Assessing democratic outcomes, economic growth, and dignity of citizens.',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[4]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      // Geography Notes
      {
        title: 'Resources and Development Core Notes',
        description: 'Classification of resources, resource planning in India, and land degradation solutions.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Forest and Wildlife Resources Notes',
        description: 'Flora and fauna distribution in India, conservation, and community forest management.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[1]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Water Resources Revision Notes',
        description: 'Scarcity, dams pros/cons, rainwater harvesting methods, and projects map.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[2]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Agriculture Core Notes',
        description: 'Primitive, intensive subsistence and commercial farming, main food and non-food crops.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[3]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Minerals and Energy Resources Notes',
        description: 'Classification of minerals, distribution maps, conventional and non-conventional energy sources.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[4]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Manufacturing Industries Revision Notes',
        description: 'Contribution of manufacturing, agro-based vs mineral-based industries, and environment measures.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[5]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Lifelines of National Economy Notes',
        description: 'Golden Quadrilateral, National Highways, railways zone, pipelines, sea ports, and international trade.',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[6]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      // Economics Notes
      {
        title: 'Development Core Notes',
        description: 'Income and other goals, public facilities, and Human Development Index (HDI) factors.',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[0]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Sectors of the Indian Economy Notes',
        description: 'Comparing primary, secondary and tertiary sectors, employment generation, and NREGA 2005.',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[1]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Money and Credit Revision Notes',
        description: 'Double coincidence of wants, barter system, banking systems, terms of credit, and Self Help Groups (SHGs).',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[2]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Globalisation and the Indian Economy Notes',
        description: 'Foreign trade and market integration, factors enabling globalisation, WTO rules, and fair globalisation.',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[3]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Consumer Rights Core Notes',
        description: 'Consumer movement, COPRA 1986, consumer courts, rights and duties of consumers.',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[4]._id,
        class: '10',
        resourceType: 'notes',
        uploadedBy: adminUser._id,
      },
    ]);
    console.log('Seeded sample student study notes.');

    // ----------------------------------------------------
    // SEED PYQs
    // ----------------------------------------------------
    await Resource.create([
      {
        title: 'The Rise of Nationalism in Europe Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[0]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Nationalism in India 5-Year Board Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[1]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Making of a Global World Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[2]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Age of Industrialisation Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[3]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Print Culture and the Modern World Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[4]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Power Sharing 3-Year PYQ Bank',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[0]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Federalism 5-Year PYQ Bank',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[1]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Gender, Religion and Caste Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[2]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Political Parties 5-Year Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[3]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Outcomes of Democracy Board PYQs',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[4]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      // Geography PYQs
      {
        title: 'Resources and Development 5-Year PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Forest and Wildlife Resources Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[1]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Water Resources Board PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[2]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Agriculture 5-Year Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[3]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Minerals and Energy Resources Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[4]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Manufacturing Industries 3-Year PYQ Bank',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[5]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Lifelines of National Economy Board Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[6]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      // Economics PYQs
      {
        title: 'Development 5-Year Board Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[0]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Sectors of the Indian Economy Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[1]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Money and Credit 5-Year PYQ Bank',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[2]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Globalisation and the Indian Economy Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[3]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Consumer Rights Board Solved PYQs',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[4]._id,
        class: '10',
        resourceType: 'pyq',
        uploadedBy: adminUser._id,
      },
    ]);
    console.log('Seeded sample subject PYQs.');

    // ----------------------------------------------------
    // SEED REVISION SHORTS
    // ----------------------------------------------------
    await Resource.create([
      {
        title: 'Rise of Nationalism Timeline',
        description: 'Important events in Europe unification from 1815 to 1871.',
        videoUrl: sstDummyUrl,
        duration: '01:00',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[0]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Satyagraha Movements in India',
        description: 'Quick check of Satyagraha at Champaran, Kheda, and Ahmedabad (1916-1918).',
        videoUrl: sstDummyUrl,
        duration: '01:00',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[1]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Silk Routes Link the World',
        description: 'How silk routes pre-date modern trade and link global economies.',
        videoUrl: sstDummyUrl,
        duration: '00:55',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[2]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Steam Engine Evolution',
        description: 'Quick breakdown of Newcomen and James Watt steam engines.',
        videoUrl: sstDummyUrl,
        duration: '00:58',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[3]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Gutenberg Printing Press',
        description: 'Tracing the first mechanical printing press invented by Johannes Gutenberg.',
        videoUrl: sstDummyUrl,
        duration: '00:50',
        subjectId: history10._id,
        chapterId: createdHistoryChaps[4]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      // Previous Year Papers for all 5 chapters
      {
        title: 'The Rise of Nationalism in Europe 2025 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[0]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Nationalism in India 2024 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[1]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Making of a Global World 2025 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[2]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'The Age of Industrialisation 2024 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[3]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Print Culture and the Modern World 2023 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: history10._id,
        chapterId: createdHistoryChaps[4]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2023,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Prudential vs Moral Power Sharing',
        description: 'Quick breakdown of the two reasons for sharing power.',
        videoUrl: sstDummyUrl,
        duration: '00:45',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[0]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Decentralization in India 1992',
        description: 'Quick check of the 1992 amendment of federal system.',
        videoUrl: sstDummyUrl,
        duration: '00:50',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[1]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Women Political Representation',
        description: 'Dilemma of female political participation in local and national bodies.',
        videoUrl: sstDummyUrl,
        duration: '00:55',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[2]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'National vs State Parties',
        description: 'Quick difference between national and regional state parties.',
        videoUrl: sstDummyUrl,
        duration: '00:40',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[3]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Accountable & Responsive Govt',
        description: 'Quick summary of expectations from democracy outcomes.',
        videoUrl: sstDummyUrl,
        duration: '00:48',
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[4]._id,
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      // Previous Year Papers for all 5 chapters
      {
        title: 'Power Sharing 2025 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[0]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Federalism 2024 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[1]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Gender, Religion and Caste 2025 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[2]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Political Parties 2024 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[3]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Outcomes of Democracy 2023 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: civics10._id,
        chapterId: createdCivicsChaps[4]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2023,
        uploadedBy: adminUser._id,
      },
      // Geography Shorts
      {
        title: 'Different Types of Soils in India',
        description: 'Summary of Alluvial, Black, Red, Laterite, and Arid soils.',
        videoUrl: sstDummyUrl,
        duration: '00:55',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id, // Ch 1
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Reserved vs Protected Forests',
        description: 'Quick check of forest classifications and their preservation state.',
        videoUrl: sstDummyUrl,
        duration: '00:48',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[1]._id, // Ch 2
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Multi-Purpose River Projects',
        description: 'Bhakra Nangal and Hirakud projects benefits in 45 seconds.',
        videoUrl: sstDummyUrl,
        duration: '00:45',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[2]._id, // Ch 3
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Rabi vs Kharif Crops',
        description: 'Quick comparison of sowing and harvesting periods of crops.',
        videoUrl: sstDummyUrl,
        duration: '00:50',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[3]._id, // Ch 4
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Conventional Energy Sources',
        description: 'Summary of coal, petroleum, natural gas, and electricity.',
        videoUrl: sstDummyUrl,
        duration: '00:52',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[4]._id, // Ch 5
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Agro-based vs Mineral-based',
        description: 'Quick definition and examples of industrial classifications.',
        videoUrl: sstDummyUrl,
        duration: '00:40',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[5]._id, // Ch 6
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Golden Quadrilateral Highway',
        description: 'Connecting Delhi, Mumbai, Chennai, and Kolkata via super highways.',
        videoUrl: sstDummyUrl,
        duration: '00:58',
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[6]._id, // Ch 7
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      // Economics Shorts
      {
        title: 'Human Development Index (HDI)',
        description: 'Key three metrics of HDI: Life expectancy, education, and per capita income.',
        videoUrl: sstDummyUrl,
        duration: '00:50',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[0]._id, // Ch 1
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Primary vs Secondary vs Tertiary',
        description: 'Quick breakdown of economic sectors in 45 seconds.',
        videoUrl: sstDummyUrl,
        duration: '00:45',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[1]._id, // Ch 2
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'Double Coincidence of Wants',
        description: 'Barter system limits and money solution overview.',
        videoUrl: sstDummyUrl,
        duration: '00:48',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[2]._id, // Ch 3
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'What is WTO?',
        description: 'Quick role of World Trade Organization in international trade rules.',
        videoUrl: sstDummyUrl,
        duration: '00:42',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[3]._id, // Ch 4
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      {
        title: 'COPRA 1986 consumer court',
        description: 'Introduction to Consumer Protection Act three-tier system.',
        videoUrl: sstDummyUrl,
        duration: '00:55',
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[4]._id, // Ch 5
        class: '10',
        resourceType: 'short',
        uploadedBy: adminUser._id,
      },
      // Previous Year Papers for all 7 Geography chapters
      {
        title: 'Resources and Development 2025 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[0]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Forest and Wildlife Resources 2024 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[1]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Water Resources 2025 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[2]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Agriculture 2024 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[3]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Minerals and Energy Resources 2025 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[4]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Manufacturing Industries 2024 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[5]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Lifelines of National Economy 2023 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: geography10._id,
        chapterId: createdGeographyChaps[6]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2023,
        uploadedBy: adminUser._id,
      },
      // Previous Year Papers for all 5 Economics chapters
      {
        title: 'Development 2025 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[0]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Sectors of the Indian Economy 2024 Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[1]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Money and Credit 2025 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[2]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2025,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Globalisation and the Indian Economy 2024 Paper',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[3]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2024,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Consumer Rights 2023 Board Solved Paper',
        pdfUrl: dummyPdf,
        subjectId: economics10._id,
        chapterId: createdEconomicsChaps[4]._id,
        class: '10',
        resourceType: 'paper',
        board: 'CBSE',
        year: 2023,
        uploadedBy: adminUser._id,
      },
    ]);
    console.log('Seeded sample concept revision shorts.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seedData();
