#include <migrator.hpp>

ACTION migrator::setupgl()
{
    require_auth(contractn);

    glstats _glstats(contractn, contractn.value);

    auto gl_itr = _glstats.begin();
    eosio::check(gl_itr == _glstats.end(), "Settings are set up already.");

    if (gl_itr == _glstats.end())
    {
        _glstats.emplace(contractn, [&](auto &new_stats) {
            new_stats.id = 0;
        });
    }
}

// Optional: use if you want to support items buying
ACTION migrator::transfer(eosio::name from, eosio::name to, eosio::asset quantity, std::string memo)
{
    require_auth(from);

    eosio::check(from != to, "Cannot transfer to self.");

    if (get_self() != to)
        return;

    eosio::check(quantity.symbol.code() == eosio::symbol_code("EOS"), "Invalid token");
    eosio::check(quantity.is_valid(), "Invalid quantity");
    eosio::check(quantity.amount > 0, "Must transfer positive quantity");
    eosio::check(memo.size() <= 256, "Memo has more than 256 bytes");

    buyitem(from, memo);
}

ACTION migrator::createitem(std::string item_name, std::string idata, std::string mdata)
{
    require_auth(contractn);

    glstats _glstats(contractn, contractn.value);

    auto gl_itr = _glstats.begin();
    eosio::check(gl_itr != _glstats.end(), "Setting are not initialized");

    uint64_t item_id = gl_itr->items;
    item_id++;

    _glstats.modify(gl_itr, contractn, [&](auto &mod_stats) {
        mod_stats.items++;
    });

    items _items(contractn, contractn.value);

    auto item_itr = _items.find(item_id);
    eosio::check(item_itr == _items.end(), "Item with current id is present.");

    _items.emplace(contractn, [&](auto &new_item) {
        new_item.id = item_id;
        new_item.item_name = item_name;
        new_item.idata = idata;
        new_item.mdata = mdata;
    });
}

ACTION migrator::sendtomarket(eosio::name username, std::string item_id)
{
    require_auth(contractn);

    users _users(contractn, contractn.value);

    auto user_itr = _users.find(username.value);
    eosio::check(user_itr != _users.end(), "User doesn't exist on table.");

    uint32_t id = std::stoi(item_id);
    uint32_t pos = finder(user_itr->ownitems, id);

    _users.modify(user_itr, contractn, [&](auto &mod_user) {
        if (mod_user.ownitems.at(pos).amount > 1)
        {
            mod_user.ownitems.at(pos).amount--;
        }
        else
        {
            mod_user.ownitems.erase(mod_user.ownitems.begin() + pos);
        }
    });
}

ACTION migrator::getfrommk(eosio::name username, std::string card)
{
    require_auth(contractn);

    users _users(contractn, contractn.value);

    auto user_itr = _users.find(username.value);
    eosio::check(user_itr != _users.end(), "User doesn't exist on table.");

    items _items(contractn, contractn.value);

    uint32_t id, pos, number;
    size_t symbol;

    while (!card.empty())
    {
        symbol = card.find(":");
        if (symbol == std::string::npos)
        {
            break;
        }
        else
        {
            id = std::stoi(card.substr(0, pos));
        }
        card.erase(0, pos + 1);

        auto item_itr = _items.find(id);
        eosio::check(item_itr != _items.end(), "Cannot find items by the specified id");

        symbol = card.find(",");
        eosio::check(symbol == std::string::npos && card.empty(), "Bad format, after id must be number of things.");
        if (symbol == std::string::npos && !card.empty())
        {
            id = std::stoi(card);
        }
        else
        {
            id = std::stoi(card.substr(0, pos));
        }
        card.erase(0, pos + 1);

        pos = finder(user_itr->ownitems, id);

        _users.modify(user_itr, get_self(), [&](auto &mod_user) {
            if (pos != -1)
            {
                mod_user.ownitems.at(pos).amount += number;
            }
            else
            {
                mod_user.ownitems.push_back({id, item_itr->item_name, number});
            }
        });
    }
}

ACTION migrator::createlog(eosio::name username, std::string item_id, std::string status)
{
    require_auth(username);

    glstats _glstats(contractn, contractn.value);
    auto gl_itr = _glstats.begin();
    eosio::check(gl_itr != _glstats.end(), "Settings are not initialized.");

    uint64_t log_id = gl_itr->logs;
    log_id++;

    _glstats.modify(gl_itr, contractn, [&](auto mod_gl) {
        mod_gl.logs++;
    });

    logs _logs(contractn, contractn.value);
    auto log_itr = _logs.find(log_id);
    eosio::check(log_itr == _logs.end(), "Log with this id was created.");

    _logs.emplace(contractn, [&](auto &new_log) {
        new_log.id = log_id;
        new_log.username = username;
        new_log.item_id = item_id;
        new_log.status = status;
    });
}

// Optional
void migrator::buyitem(eosio::name username, std::string card)
{
    eosio::check(eosio::is_account(username), "User account doesn't exist.");
    users _users(contractn, contractn.value);

    items _items(contractn, contractn.value);

    // Put you buy items implementation here
}

uint32_t migrator::finder(std::vector<ownitem> itm, uint64_t id)
{
    for (int i = 0; i < itm.size(); i++)
    {
        if (itm.at(i).id == id)
        {
            return i;
        }
    }
    return -1;
}

extern "C" void apply(uint64_t receiver, uint64_t code, uint64_t action)
{
    if (code == "eosio.token"_n.value && action == "transfer"_n.value)
    {
        eosio::execute_action(eosio::name(receiver), eosio::name(code), &migrator::transfer);
    }
    else if (code == receiver)
    {

        switch (action)
        {
            EOSIO_DISPATCH_HELPER(migrator, (setupgl)(createitem)(sendtomarket)(getfrommk)(createlog))
        }
    }
}