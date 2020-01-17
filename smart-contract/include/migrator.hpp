#pragma once
#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/symbol.hpp>
#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>
#include <eosio/singleton.hpp>

// Name of contract account
#define contractn eosio::name("nameofcontr1")

// Name of an account for action calls 
#define actioncontr eosio::name("nameofcallac")

CONTRACT migrator : public eosio::contract
{
public:
    using contract::contract;

    // Contract settings
    ACTION setupgl();
    using setupgl_action = eosio::action_wrapper<eosio::name("setupgl"), &migrator::setupgl>;
    
    // Optional: buy items support
    ACTION transfer(eosio::name from, eosio::name to, eosio::asset quantity, std::string memo);
    using transfer_action = eosio::action_wrapper<eosio::name("transfer"), &migrator::transfer>;
    
    // New item creation within the contract
    ACTION createitem(std::string item_name, std::string idata, std::string mdata);
    using createitem_action = eosio::action_wrapper<eosio::name("createitem"), &migrator::createitem>;
    
    // Export of an item to NFT
    ACTION sendtomarket(eosio::name username, std::string item_id);
    using sendtomarket_action = eosio::action_wrapper<eosio::name("sendtomarket"), &migrator::sendtomarket>;
    
    // Import of an NFT into comntract
    ACTION getfrommk(eosio::name username, std::string card);
    using getfrommk_action = eosio::action_wrapper<eosio::name("getfrommk"), &migrator::getfrommk>;
    
    
    ACTION createlog(eosio::name username, std::string item_id, std::string status);
    using createlog_action = eosio::action_wrapper<eosio::name("createlog"), &migrator::createlog>;
    

private:
    struct ownitem
    {
        uint64_t id;
        std::string name;
        uint64_t amount;
    };

    TABLE glstat
    {
        uint64_t id{0};    //basic id
        uint64_t items{0}; //items number
        uint64_t logs{0};  //log number

        uint64_t primary_key() const { return id; }
    };
    using glstats = eosio::multi_index<eosio::name("glstats"), glstat>;

    TABLE item
    {
        uint64_t id{0};
        std::string item_name;
        std::string idata;
        std::string mdata;

        uint64_t primary_key() const { return id; }
    };
    using items = eosio::multi_index<eosio::name("items"), item>;

    TABLE log
    {
        uint64_t id{0};
        eosio::name username;
        std::string item_id;
        std::string status;

        uint64_t primary_key() const { return id; }
    };
    using logs = eosio::multi_index<eosio::name("logs"), log>;

    TABLE user
    {
        eosio::name username;
        std::vector<ownitem> ownitems;

        uint64_t primary_key() const { return username.value; }
    };
    using users = eosio::multi_index<eosio::name("users"), user>;

    void buyitem(eosio::name username, std::string card);
    uint32_t finder(std::vector<ownitem> itm, uint64_t id);
};