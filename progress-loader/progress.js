const progressBar = document.getElementById('progress-bar');
const progressNumber = document.getElementById('progress-number');
const maxCircumference = 534; // បរិមាត្ររង្វង់

// អនុគមន៍សម្រាប់រត់ខ្សែរង្វង់ និងបង្ហាញលេខ %
function setProgress(percent) {
    // រក្សាទុកភាគរយចន្លោះពី 0 ដល់ 100
    percent = Math.min(Math.max(percent, 0), 100); 
    
    const offset = maxCircumference - (percent / 100) * maxCircumference;
    progressBar.style.strokeDashoffset = offset;
    progressNumber.innerText = `${Math.round(percent)}%`;
}

// ចាប់ផ្តើមតាមដាន Real Loading Progress
function trackRealProgress() {
    // ១. ប្រមូលរាល់ប្រភពទិន្នន័យដែលទំព័រ Web ត្រូវទាញយក (Images, Styles, Scripts)
    const resources = performance.getEntriesByType('resource');
    const totalResources = resources.length;

    if (totalResources === 0) {
        // បើគ្មានទិន្នន័យអ្វីត្រូវទាញយកទេ គឺពេញ 100% ភ្លាមៗ
        setProgress(100);
        hideLoader();
        return;
    }

    // ២. រាប់ចំនួនទិន្នន័យដែលបាន Load រួចរាល់ទាំងស្រុង
    let loadedResources = 0;
    resources.forEach((resource) => {
        if (resource.duration > 0 || resource.responseEnd > 0) {
            loadedResources++;
        }
    });

    // ៣. គណនាភាគរយពិតប្រាកដ
    const currentPercent = (loadedResources / totalResources) * 100;
    setProgress(currentPercent);

    // ៤. បើសិនជាមិនទាន់ Load ចប់ទេ ឱ្យវារក្សាការគណនាបន្តទៀត
    if (loadedResources < totalResources) {
        requestAnimationFrame(trackRealProgress);
    } else {
        // នៅពេលអ៊ិនធឺណិតទាញយកបាន 100% ពេញលេញ
        setProgress(100);
        setTimeout(hideLoader, 500); // ពន្យារពេល 0.5 វិនាទី រួចបាត់ Loader
    }
}

// អនុគមន៍សម្រាប់បិទ/លាក់ប្រអប់ Loading នៅពេល Web រត់ពេញ
function hideLoader() {
    const loaderContainer = document.querySelector('.glass-loader-container');
    loaderContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    loaderContainer.style.opacity = '0';
    loaderContainer.style.transform = 'scale(1)';
    
    // លុបវាចេញពីអេក្រង់ក្រោយពេល Effect បាត់ (Fade out)
    setTimeout(() => {
        loaderContainer.style.display = 'none';
    }, 500);
}

// ដំណើរការកូដភ្លាមៗនៅពេលបើកទំព័រ Web
// ប្រើ 'window.onload' ដើម្បីដឹងថាទិន្នន័យទាំងអស់ត្រូវបាន Load ចប់សព្វគ្រប់
window.addEventListener('load', () => {
    setProgress(100);
    setTimeout(hideLoader, 500);
});

// រត់ការតាមដានរាល់ពេលមានទិន្នន័យកំពុងទាញយកតាម Internet
requestAnimationFrame(trackRealProgress);